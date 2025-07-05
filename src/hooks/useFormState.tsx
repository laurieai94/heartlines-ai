
import { useState, useEffect } from 'react';

export const useFormState = (initialData: any, onDataChange?: (data: any) => void) => {
  const [formData, setFormData] = useState(initialData);

  // Update form data and notify parent
  const updateFormData = (newData: any) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      onDataChange?.(updated);
      return updated;
    });
  };

  // Update single field
  const updateField = (field: string, value: string) => {
    console.log(`Updating field ${field} with value:`, value);
    updateFormData({ [field]: value });
  };

  // Reset form data
  const resetFormData = (data: any) => {
    setFormData(data);
  };

  return {
    formData,
    setFormData,
    updateFormData,
    updateField,
    resetFormData
  };
};
