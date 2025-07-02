
import { useState } from 'react';
import { useTemporaryProfile } from './useTemporaryProfile';
import { useNavigation } from '@/contexts/NavigationContext';

export const usePersonalProfileQuestionnaire = () => {
  const { goToCoach } = useNavigation();

  const handleStartChatting = () => {
    console.log('usePersonalProfileQuestionnaire: Starting chat, navigating to coach');
    goToCoach();
  };

  return {
    handleStartChatting
  };
};
