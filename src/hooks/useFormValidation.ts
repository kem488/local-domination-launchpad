import { useState } from "react";

interface FormData {
  businessName: string;
  phone: string;
  email: string;
  postcode: string;
  name?: string;
  businessType?: string;
  annualRevenue?: string;
  employees?: string;
}

interface FormErrors {
  businessName?: string;
  phone?: string;
  email?: string;
  postcode?: string;
}

export const useFormValidation = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    phone: "",
    email: "",
    postcode: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'businessName':
        return value.trim().length < 2 ? 'Business name must be at least 2 characters' : undefined;
      case 'phone':
        const phoneRegex = /^(\+44|0)[0-9]{10,11}$/;
        return !phoneRegex.test(value.replace(/\s/g, '')) ? 'Please enter a valid UK phone number' : undefined;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : undefined;
      case 'postcode':
        const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
        return !postcodeRegex.test(value.replace(/\s/g, '')) ? 'Please enter a valid UK postcode' : undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.businessName = validateField('businessName', formData.businessName);
    newErrors.phone = validateField('phone', formData.phone);
    newErrors.email = validateField('email', formData.email);
    newErrors.postcode = validateField('postcode', formData.postcode);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Progressive validation: validate on blur for better UX
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const submitForm = async (callback?: (data: FormData) => Promise<void>) => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (callback) {
        await callback(formData);
      }
      setSubmitStatus('success');
      // Reset form after successful submission
      setFormData({
        businessName: "",
        phone: "",
        email: "",
        postcode: ""
      });
      return true;
    } catch (error) {
      setSubmitStatus('error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    updateField,
    validateField,
    submitForm,
    setSubmitStatus
  };
};