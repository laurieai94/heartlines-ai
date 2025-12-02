import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

interface PatternDetectionRequest {
  conversationId: string;
  messages: Array<{ role: string; content: string }>;
  userId: string;
}

interface DetectedPattern {
  type: string;
  description: string;
  evidence: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { conversationId, messages, userId }: PatternDetectionRequest = await req.json();

    if (!messages || messages.length < 5) {
      return new Response(
        JSON.stringify({ patterns: [], message: 'Not enough messages for pattern detection' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation text for analysis
    const conversationText = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Call Anthropic to detect patterns
    const patternPrompt = `Analyze this relationship coaching conversation for recurring patterns. 

Identify any of these patterns if clearly present:
- partner_minimizing: Partner dismisses/downplays user's feelings or concerns
- communication_breakdown: Shutting down, avoiding difficult topics, stonewalling
- family_interference: External family causing relationship stress or conflict
- trust_erosion: Recurring trust issues, jealousy patterns, or betrayal themes
- intimacy_avoidance: Physical or emotional intimacy being avoided or withheld
- unequal_effort: One partner carrying more weight in the relationship
- boundary_violations: Boundaries being crossed or ignored repeatedly
- conflict_escalation: Arguments spiraling or becoming explosive
- financial_stress: Money-related tension or disagreements
- identity_struggle: Coming out, religious differences, LGBTQ+ issues

Conversation:
${conversationText}

Return ONLY valid JSON in this exact format:
{
  "patterns": [
    {
      "type": "pattern_type",
      "description": "Brief description",
      "evidence": "Specific quote or context from conversation"
    }
  ]
}

If no clear patterns exist, return: {"patterns": []}`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        messages: [
          { role: 'user', content: patternPrompt }
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const error = await anthropicResponse.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const responseText = anthropicData.content[0].text;
    
    let detectedPatterns: DetectedPattern[] = [];
    try {
      const parsed = JSON.parse(responseText);
      detectedPatterns = parsed.patterns || [];
    } catch (e) {
      console.error('Failed to parse pattern detection response:', responseText);
      detectedPatterns = [];
    }

    // Store or update patterns in database
    for (const pattern of detectedPatterns) {
      // Check if pattern already exists for this user
      const { data: existingPattern } = await supabaseClient
        .from('relationship_patterns')
        .select('*')
        .eq('user_id', userId)
        .eq('pattern_type', pattern.type)
        .eq('is_resolved', false)
        .maybeSingle();

      if (existingPattern) {
        // Update existing pattern
        await supabaseClient
          .from('relationship_patterns')
          .update({
            frequency: existingPattern.frequency + 1,
            last_seen: new Date().toISOString(),
            conversation_ids: [...(existingPattern.conversation_ids || []), conversationId],
            context_snippets: [...(existingPattern.context_snippets || []), pattern.evidence],
          })
          .eq('id', existingPattern.id);
      } else {
        // Create new pattern
        await supabaseClient
          .from('relationship_patterns')
          .insert({
            user_id: userId,
            pattern_type: pattern.type,
            pattern_description: pattern.description,
            frequency: 1,
            conversation_ids: [conversationId],
            context_snippets: [pattern.evidence],
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        patterns: detectedPatterns,
        message: `Detected ${detectedPatterns.length} pattern(s)`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in detect-patterns:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
