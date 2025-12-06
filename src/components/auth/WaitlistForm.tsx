import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface WaitlistFormProps {
  email?: string;
  message?: string;
  onBack?: () => void;
}

const WaitlistForm = ({ email: initialEmail = '', message, onBack }: WaitlistFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: email.toLowerCase().trim(),
          name: name.trim() || null
        });

      if (insertError) {
        if (insertError.code === '23505') {
          // Duplicate email
          setIsSubmitted(true);
          return;
        }
        throw insertError;
      }

      setIsSubmitted(true);
      toast.success("spot saved ✨", {
        description: "we'll hit you up the second there's room."
      });

    } catch (err: any) {
      console.error('Waitlist error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 p-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-coral-400/20 to-pink-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-coral-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">spot saved ✨</h3>
          <p className="text-white/70 text-sm">
            we'll hit you up the second there's room.
          </p>
        </div>

        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white/60 hover:text-white/80 hover:bg-white/5 text-sm mt-4"
          >
            back to home
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-coral-400/20 to-pink-500/20 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-coral-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-white">kai's couch is full rn 😭</h3>
        <p className="text-white/70 text-sm">
          {message || "we're letting people in waves so kai can actually give good advice. drop your info and we'll invite you the second there's space."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="waitlist-name" className="text-white text-sm">
            name <span className="text-white/40">(optional)</span>
          </Label>
          <Input
            id="waitlist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name or nickname (both are welcome)"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="waitlist-email" className="text-white text-sm">
            email
          </Label>
          <Input
            id="waitlist-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="where should we send your invite?"
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
            <p className="text-red-300 text-xs">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full questionnaire-button-primary py-2 text-sm"
        >
          {isSubmitting ? 'saving...' : 'save my spot'}
        </Button>
      </form>

      {onBack && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white/60 hover:text-white/80 hover:bg-white/5 text-sm"
          >
            back to home
          </Button>
        </div>
      )}
    </div>
  );
};

export default WaitlistForm;
