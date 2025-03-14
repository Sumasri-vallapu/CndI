// Validation utilities for form inputs

/**
 * Validates an Indian mobile number
 * Must be 10 digits and start with 6, 7, 8, or 9
 */
export const validateMobileNumber = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

/**
 * Get mobile validation error message based on input length
 */
export const getMobileErrorMessage = (mobile: string): string => {
  if (!mobile) return "";
  
  if (mobile.length > 10) {
    return "Mobile number should be 10 digits";
  }
  
  if (mobile.length === 10 && !validateMobileNumber(mobile)) {
    return "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9";
  }
  
  return "";
}; 