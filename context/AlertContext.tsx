import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { AppAlert, AlertButton } from '@/components/app-alert';

interface AlertConfig {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

interface AlertContextType {
  showAlert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: '',
    message: undefined,
    buttons: [{ text: 'OK' }],
  });

  const showAlert = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      setConfig({
        title,
        message,
        buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
      });
      setVisible(true);
    },
    [],
  );

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AppAlert
        visible={visible}
        title={config.title}
        message={config.message}
        buttons={config.buttons}
        onDismiss={handleDismiss}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
