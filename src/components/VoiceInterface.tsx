
import React from "react";
import { useVoiceRecording } from "./voice/useVoiceRecording";
import { useTextToSpeech } from "./voice/useTextToSpeech";
import { AudioToggleButton } from "./voice/AudioToggleButton";
import { VoiceRecordingButton } from "./voice/VoiceRecordingButton";

interface VoiceInterfaceProps {
  onVoiceMessage: (message: string) => void;
  onSpeakResponse?: (speakFunction: (text: string) => void) => void;
  disabled?: boolean;
}

const VoiceInterface = ({ onVoiceMessage, onSpeakResponse, disabled }: VoiceInterfaceProps) => {
  const { isRecording, handleMicClick } = useVoiceRecording({ 
    onVoiceMessage, 
    disabled 
  });
  
  const { isSpeaking, audioEnabled, toggleAudio } = useTextToSpeech({ 
    onSpeakResponse 
  });

  return (
    <div className="flex gap-2">
      <AudioToggleButton
        audioEnabled={audioEnabled}
        onToggle={toggleAudio}
        disabled={disabled}
      />

      <VoiceRecordingButton
        isRecording={isRecording}
        onClick={handleMicClick}
        disabled={disabled || isSpeaking}
      />
    </div>
  );
};

export default VoiceInterface;
