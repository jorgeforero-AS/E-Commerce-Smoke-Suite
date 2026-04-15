export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const CheckoutData = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  } as CheckoutInfo,

  // missing first name to trigger the validation error
  missingFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  } as CheckoutInfo,
} as const;
