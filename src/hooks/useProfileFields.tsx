
interface PersonalProfileData {
  [key: string]: any;
}

export const useProfileFields = (
  profileData: PersonalProfileData,
  saveData: (newData: Partial<PersonalProfileData>) => Promise<void>
) => {
  // Update single field
  const updateField = (field: string, value: any) => {
    console.log(`Updating field: ${field} with value:`, value);
    const updatedData = { [field]: value };
    saveData(updatedData);
  };

  // Handle multi-select fields
  const handleMultiSelect = (field: string, value: string) => {
    const currentData = profileData || {};
    const current = currentData[field] || [];
    const updated = current.includes(value) 
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    
    console.log(`Multi-select update for ${field}:`, updated);
    updateField(field, updated);
  };

  return {
    updateField,
    handleMultiSelect
  };
};
