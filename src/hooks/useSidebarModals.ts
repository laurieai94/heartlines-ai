
import { useState } from 'react';

export const useSidebarModals = () => {
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [viewingProfileType, setViewingProfileType] = useState<'your' | 'partner'>('your');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [activeProfileType, setActiveProfileType] = useState<'your' | 'partner'>('your');

  const openProfileViewer = (profileType: 'your' | 'partner') => {
    setViewingProfileType(profileType);
    setShowProfileViewer(true);
  };

  const closeProfileViewer = () => {
    setShowProfileViewer(false);
  };

  const openProfileForm = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    setShowProfileForm(true);
  };

  const closeProfileForm = () => {
    setShowProfileForm(false);
  };

  const openDemographics = (profileType: 'your' | 'partner') => {
    setActiveProfileType(profileType);
    setShowDemographics(true);
  };

  const closeDemographics = () => {
    setShowDemographics(false);
  };

  const editProfile = () => {
    setShowProfileViewer(false);
    setActiveProfileType(viewingProfileType);
    setShowProfileForm(true);
  };

  const backToDemographics = () => {
    setShowProfileForm(false);
    setShowDemographics(true);
  };

  return {
    showProfileViewer,
    viewingProfileType,
    showProfileForm,
    showDemographics,
    activeProfileType,
    openProfileViewer,
    closeProfileViewer,
    openProfileForm,
    closeProfileForm,
    openDemographics,
    closeDemographics,
    editProfile,
    backToDemographics
  };
};
