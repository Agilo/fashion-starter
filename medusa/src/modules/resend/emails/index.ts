import AuthPasswordResetEmail from './auth-password-reset';
import OrderPlacedEmail from './order-placed';

export const subjects = {
  'auth-password-reset': 'Reset your password',
  'order-placed': 'Your order has been placed',
};

export default {
  'auth-password-reset': AuthPasswordResetEmail,
  'order-placed': OrderPlacedEmail,
};