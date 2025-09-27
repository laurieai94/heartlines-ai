
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VoiceInterfaceProps {
  onVoiceMessage: (message: string) => void;
  onSpeakResponse?: (speakFunction: (text: string) => void) => void;
  disabled?: boolean;
}

const VoiceInterface = ({ onVoiceMessage, onSpeakResponse, disabled }: VoiceInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data:audio/webm;base64, prefix
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Get supported mime type for MediaRecorder
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      undefined // Let browser choose
    ];
    
    for (const type of types) {
      if (!type || MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  };

  // Register the speak function with parent component when audio is enabled
  React.useEffect(() => {
    if (onSpeakResponse && audioEnabled) {
      onSpeakResponse(speakText);
    }
  }, [onSpeakResponse, audioEnabled]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Processing voice message...");
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Check if blob is empty or too small
      if (audioBlob.size === 0) {
        toast.error("No speech detected - recording was empty");
        return;
      }

      // Log diagnostics
      console.log('Recording details:', {
        size: audioBlob.size,
        type: audioBlob.type,
        duration: 'unknown'
      });

      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      console.log('Base64 audio length:', base64Audio.length);

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio },
      });

      if (error) {
        console.error('Transcription error:', error);
        
        // Try to extract detailed error message
        let errorMessage = 'Unknown error';
        if (error.message) {
          errorMessage = error.message;
        } else if (error.context?.body) {
          try {
            const errorBody = JSON.parse(error.context.body);
            errorMessage = errorBody.error || errorMessage;
          } catch {
            errorMessage = error.context.body;
          }
        }
        
        toast.error(`Failed to transcribe audio: ${errorMessage}`);
        return;
      }

      if (data?.text && data.text.trim()) {
        onVoiceMessage(data.text);
        toast.success("Voice message processed!");
      } else {
        toast.error("No speech detected");
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error("Failed to process voice message");
    }
  };

  const speakText = async (text: string) => {
    if (!audioEnabled || !text.trim()) return;

    try {
      // Stop any current speech
      if (currentUtteranceRef.current) {
        speechSynthesis.cancel();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      setIsSpeaking(true);

      // Try to use Supabase TTS first, fallback to browser TTS
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { 
            text: text.substring(0, 1000), // Limit text length
            voice: 'alloy' // Default voice
          }
        });

        if (!error && data?.audioContent) {
          // Convert base64 to audio blob and play
          const binaryString = atob(data.audioContent);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          currentAudioRef.current = audio;
          
          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
          };
          
          audio.onerror = () => {
            console.log('TTS audio failed, falling back to browser speech');
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
            fallbackToSpeechSynthesis(text);
          };
          
          await audio.play();
        } else {
          console.log('TTS returned no audio content, using browser speech');
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
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
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

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex gap-2">
      {/* Audio Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleAudio}
        disabled={disabled}
        className={`w-12 h-12 rounded-2xl transition-all duration-300 ${
          audioEnabled 
            ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
            : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
        }`}
      >
        {audioEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>

      {/* Voice Recording */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleMicClick}
        disabled={disabled || isSpeaking}
        className={`w-12 h-12 rounded-2xl transition-all duration-300 ${
          isRecording 
            ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100 animate-pulse' 
            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
        }`}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default VoiceInterface;
