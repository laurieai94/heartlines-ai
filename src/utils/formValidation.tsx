
export const validatePage2Required = (formData: any): { isValid: boolean; missing: string[] } => {
  const required = [
    'conflictResponse', 
    'stressSpaceNeed', 
    'stressSupportNeed', 
    'goSilentWhenUpset', 
    'needToTalkImmediately', 
    'beingRushedMakesWorse', 
    'feelHeardWithValidation'
  ];
  
  const missing = required.filter(field => !formData[field] || formData[field] === '');
  
  console.log('Page 2 validation - missing required fields:', missing);
  console.log('Page 2 current form data:', formData);
  
  return {
    isValid: missing.length === 0,
    missing
  };
};
