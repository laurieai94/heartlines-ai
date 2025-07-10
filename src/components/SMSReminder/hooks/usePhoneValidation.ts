
import { useState } from 'react';

export const usePhoneValidation = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

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
  };

  return {
    phoneNumber,
    isPhoneValid,
    handlePhoneChange
  };
};
