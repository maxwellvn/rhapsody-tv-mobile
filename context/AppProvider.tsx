import React, { ReactNode } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AuthProvider } from './AuthContext';
import { QueryProvider } from './QueryProvider';
import { ToastProvider } from './ToastContext';
import { AlertProvider } from './AlertContext';

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// StripeProvider crashes with an empty string — use a placeholder so the
// provider mounts and hooks like useConfirmPayment can be called safely.
const STRIPE_KEY_FOR_PROVIDER =
  STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

/**
 * Combined App Providers
 * Wraps the app with all necessary providers
 */
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryProvider>
      <StripeProvider publishableKey={STRIPE_KEY_FOR_PROVIDER}>
        <AuthProvider>
          <ToastProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </ToastProvider>
        </AuthProvider>
      </StripeProvider>
    </QueryProvider>
  );
};
