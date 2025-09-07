// Password policy requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
};

export const validatePasswordPolicy = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  if (!/[@$!%*?&]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }

  return { isValid: true, message: 'Password meets all requirements' };
};

export const getPasswordPolicyText = (): string => {
  return 'Must be 8+ characters with uppercase, lowercase, number, and special character (@$!%*?&)';
};