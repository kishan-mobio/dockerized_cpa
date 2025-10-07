// Form Validation Rules
export const USER_FORM_RULES = {
  company_name: [
    { required: true, message: 'Company name is required!' },
    { min: 2, message: 'Company name must be at least 2 characters!' },
    { max: 100, message: 'Company name cannot exceed 100 characters!' }
  ],
  email: [
    { required: true, message: 'Email is required!' },
    { type: 'email', message: 'Please enter a valid email address!' }
  ],
  sageUserID: [
    { required: true, message: 'Sage User ID is required!' },
    { min: 1, message: 'Sage User ID cannot be empty!' }
  ],
  sageUserPassword: [
    { required: true, message: 'Sage User Password is required!' },
    { min: 1, message: 'Sage User Password cannot be empty!' }
  ],
  sageSenderID: [
    { required: true, message: 'Sage Sender ID is required!' },
    { min: 1, message: 'Sage Sender ID cannot be empty!' }
  ],
  sageSenderPassword: [
    { required: true, message: 'Sage Sender Password is required!' },
    { min: 1, message: 'Sage Sender Password cannot be empty!' }
  ],
  sageCompanyID: [
    { required: true, message: 'Sage Company ID is required!' },
    { min: 1, message: 'Sage Company ID cannot be empty!' }
  ]
};
