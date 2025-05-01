// src/pages/Profile.tsx
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonAvatar, IonButton, IonButtons, IonBackButton, IonIcon
  } from '@ionic/react';
  import { logOutOutline } from 'ionicons/icons';
  import { useEffect, useState } from 'react';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { useHistory } from 'react-router';
  import { useToast } from '../contexts/useToast';
  
  const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const history = useHistory();
      const { show } = useToast();
  
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
      return () => unsubscribe();
    }, []);
  
    const handleLogout = async () => {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('uid');
      localStorage.removeItem('isLoggedIn');
      show('Logout berhasil!', 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000); // beri delay biar toast sempat tampil
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/dashboard" />
            </IonButtons>
            <IonTitle>Profil Saya</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="ion-padding">
          {user ? (
            <IonCard style={{ textAlign: 'center', padding: '20px', marginTop: '40px' }}>
              <IonAvatar style={{ margin: '0 auto', width: '100px', height: '100px' }}>
                <img
                  src={user.photoURL || '/avatar.svg'}
                  alt="Profile"
                />
              </IonAvatar>
              <IonCardHeader>
                <IonCardTitle style={{ marginTop: '10px' }}>{user.displayName || 'Admin'}</IonCardTitle>
                <IonCardSubtitle>{user.email}</IonCardSubtitle>
              </IonCardHeader>
  
              <IonButton
                expand="block"
                color="danger"
                onClick={handleLogout}
                style={{ marginTop: '20px' }}
              >
                <IonIcon slot="start" icon={logOutOutline} />
                Logout
              </IonButton>
            </IonCard>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '50%' }}>Memuat profil...</p>
          )}
        </IonContent>
      </IonPage>
    );
  };
  
  export default Profile;  