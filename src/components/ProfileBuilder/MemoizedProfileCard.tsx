import React from 'react';
import ProfileCard from './ProfileCard';

interface ProfileCardProps {
  title: string;
  subheader?: string;
  completion: number;
  description: string;
  benefits: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  onStartProfile: () => void;
  buttonText: string;
  iconElement: React.ReactNode;
  progressColor: string;
  benefitColor: string;
  optionalPillImage?: React.ReactNode;
  motivationText?: string;
}

// Memoized ProfileCard to prevent unnecessary re-renders
const MemoizedProfileCard = React.memo(ProfileCard, (prevProps, nextProps) => {
  // Only re-render if completion or essential props change
  return (
    prevProps.completion === nextProps.completion &&
    prevProps.title === nextProps.title &&
    prevProps.buttonText === nextProps.buttonText &&
    prevProps.onStartProfile === nextProps.onStartProfile
  );
});

MemoizedProfileCard.displayName = 'MemoizedProfileCard';

export default MemoizedProfileCard;