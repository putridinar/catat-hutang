import {
  IonPage, IonContent, IonInput, IonButton, IonText,
  IonItem, IonLabel, IonLoading, IonToast, IonIcon
} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { useState } from 'react';
import { auth, provider } from '../firebase';
import { useHistory } from 'react-router-dom';
import '../theme/Login.css';

interface LoginProps {
  style?: React.CSSProperties;
}

const Login: React.FC<LoginProps> = ({ style }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        window.location.href = '/dashboard';
		localStorage.setItem('isLoggedIn', 'true');
      } else {
        throw new Error('Email atau password salah');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <IonPage style={style}>
      <IonContent className="login-background" fullscreen>
        <div className="login-container">
          <img src="/sari.png" alt="Logo" className="login-logo" />
          <h1 className="login-title">Selamat Datang</h1>
          <p className="login-subtitle">Silakan login untuk melanjutkan</p>

          <IonItem lines="none" className="login-input">
            <IonInput label="Email" label-placement="floating" fill="outline"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem lines="none" className="login-input">
            <IonInput label="Password" label-placement="floating" fill="outline"
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>

          <IonButton expand="block" className="login-button" onClick={handleLogin}>
            <IonIcon icon={logInOutline} slot="start" />
            Login Email
          </IonButton>

          <IonText color="medium" className="login-footer">
            v1.0 - Aplikasi Ayah
          </IonText>
        </div>

        <IonLoading isOpen={loading} message="Mohon tunggu..." />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={2000}
          color="danger"
          onDidDismiss={() => setError('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
