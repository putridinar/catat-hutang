import { createContext, useContext, useState } from 'react';
import { IonToast } from '@ionic/react';

interface ToastContextProps {
  show: (message: string, color?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastData, setToastData] = useState({
    isOpen: false,
    message: '',
    color: 'primary',
    duration: 2000
  });

  const show = (message: string, color: string = 'primary', duration: number = 2000) => {
    setToastData({ isOpen: true, message, color, duration });
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <IonToast
        isOpen={toastData.isOpen}
        message={toastData.message}
        color={toastData.color}
        duration={toastData.duration}
        onDidDismiss={() => setToastData({ ...toastData, isOpen: false })}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};
