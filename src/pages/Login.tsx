import {
  IonPage, IonContent, IonInput, IonButton, IonText,
  IonItem, IonLabel, IonLoading, IonToast, IonIcon
} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { logoGoogle } from 'ionicons/icons';
import { useState } from 'react';
import { useToast } from '../contexts/useToast';
import { auth, provider } from '../firebase';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
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
  const { show } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('uid', user.uid);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      show('Login Error!', 'danger');
    }
  };
  
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const auth = getAuth();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Simpan status login (opsional)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('uid', user.uid);
  
      // Redirect ke dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError('Email atau password salah');
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
