import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseTextToSpeechProps {
  onSpeakResponse?: (speakFunction: (text: string) => void) => void;
}

export const useTextToSpeech = ({ onSpeakResponse }: UseTextToSpeechProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Register the speak function with parent component when audio is enabled
  useEffect(() => {
    if (onSpeakResponse && audioEnabled) {
      onSpeakResponse(speakText);
    }
  }, [onSpeakResponse, audioEnabled]);

  const speakText = async (text: string) => {
    if (!audioEnabled || !text.trim()) return;

    try {
      // Stop any current speech
      if (currentUtteranceRef.current) {
        speechSynthesis.cancel();
      }

      setIsSpeaking(true);

      // Try to use Supabase TTS first, fallback to browser TTS
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { text: text.substring(0, 1000) } // Limit text length
        });

        if (!error && data?.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => {
            console.log('TTS audio failed, falling back to browser speech');
            fallbackToSpeechSynthesis(text);
          };
          await audio.play();
        } else {
          fallbackToSpeechSynthesis(text);
        }
      } catch (error) {
        console.log('Supabase TTS failed, using browser speech:', error);
        fallbackToSpeechSynthesis(text);
      }
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      setIsSpeaking(false);
    }
  };

  const fallbackToSpeechSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      currentUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      toast.error("Text-to-speech not supported in this browser");
    }
  };

  const stopSpeaking = () => {
    if (currentUtteranceRef.current) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleAudio = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setAudioEnabled(!audioEnabled);
    toast.info(audioEnabled ? "Audio responses disabled" : "Audio responses enabled");
  };

  return {
    isSpeaking,
    audioEnabled,
    toggleAudio,
    speakText
  };
};