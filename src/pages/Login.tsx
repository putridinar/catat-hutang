import {
  IonPage, IonContent, IonInput, IonButton, IonText,
  IonItem, IonLabel, IonLoading, IonToast, IonIcon
} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { logoGoogle } from 'ionicons/icons';
import { useState } from 'react';
import { auth, provider } from '../firebase';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import '../theme/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      history.push('/dashboard'); // setelah login, arahkan ke dashboard
    } catch (error) {
      console.error("Login gagal:", error);
    }
  };
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      if (email === 'admin@sari.amd.ak' && password === 'qwerty') {
        window.location.href = '/dashboard';
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
    <IonPage>
      <IonContent className="login-background" fullscreen>
        <div className="login-container">
          <img src="/assets/logo.svg" alt="Logo" className="login-logo" />
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
            Login
          </IonButton>
		  <IonText>Atau</IonText>
      <IonButton expand="block" onClick={handleGoogleLogin} color='primary'>
            <IonIcon icon={logoGoogle} slot="start" />
        Login dengan Google
      </IonButton>

          <IonText color="medium" className="login-footer">
            v1.0 - Aplikasi Piutang Ayah
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
