
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePhoneValidation = () => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Load saved phone number on mount
  useEffect(() => {
    if (user) {
      loadSavedPhoneNumber();
    }
  }, [user]);

  const loadSavedPhoneNumber = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('user_id', user.id)
        .single();
      
      if (data?.phone_number) {
        const formatted = formatPhoneNumber(data.phone_number);
        setPhoneNumber(formatted);
      }
    } catch (error) {
      console.error('Error loading phone number:', error);
    }
  };

  const savePhoneNumber = async (phone: string) => {
    if (!user || !phone) return;
    
    try {
      const cleanedPhone = phone.replace(/\D/g, '');
      // Add +1 country code for US numbers
      const fullPhone = cleanedPhone.length === 10 ? `+1${cleanedPhone}` : phone;
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          phone_number: fullPhone,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving phone number:', error);
      }
    } catch (error) {
      console.error('Error saving phone number:', error);
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      setIsPhoneValid(true);
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    setIsPhoneValid(cleaned.length === 10);
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    
    // Save to database when valid
    if (isPhoneValid) {
      savePhoneNumber(formatted);
    }
  };

  return {
    phoneNumber,
    isPhoneValid,
    handlePhoneChange
  };
};
