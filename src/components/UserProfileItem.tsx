import {
    IonItem,
    IonAvatar,
    IonLabel,
    IonSkeletonText
  } from '@ionic/react';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { useEffect, useState } from 'react';
  
  const UserProfileItem: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    if (loading) {
      return (
        <IonItem lines="none">
          <IonAvatar slot="start">
            <IonSkeletonText animated style={{ width: '40px', height: '40px' }} />
          </IonAvatar>
          <IonLabel>
            <h2><IonSkeletonText animated style={{ width: '80%' }} /></h2>
            <p><IonSkeletonText animated style={{ width: '60%' }} /></p>
          </IonLabel>
        </IonItem>
      );
    }
  
    if (!user) return null; // bisa juga tampilkan pesan "Belum login"
  
    return (
      <IonItem lines="none">
        <IonAvatar slot="start">
          <img
            src={user.photoURL || '/avatar.svg'}
            alt="Foto Profil"
          />
        </IonAvatar>
        <IonLabel>
          <h2>{user.displayName || 'Admin'}</h2>
          <p>{user.email}</p>
        </IonLabel>
      </IonItem>
    );
  };
  
  export default UserProfileItem;