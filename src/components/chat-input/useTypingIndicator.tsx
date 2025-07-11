import { useState, useRef, useEffect } from "react";

export const useTypingIndicator = (currentMessage: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (value: string) => {
    // Show typing indicator when user starts typing
    if (value.trim() && !isTyping) {
      setIsTyping(true);
    }
    
    // Clear existing timeout and set new one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Hide typing indicator after user stops typing for 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Clear typing indicator when message is sent
  useEffect(() => {
    if (currentMessage === "") {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [currentMessage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTyping,
    handleInputChange
  };
};