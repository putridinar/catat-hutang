// src/components/TotalKasMasuk.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { IonLabel, IonText } from '@ionic/react';

const TotalKasMasuk: React.FC = () => {
  const [totalKas, setTotalKas] = useState(0);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;
  
    const fetchKas = async () => {
      const q = query(collection(db, 'kasMasuk'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const total = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + parseInt(data.jumlah || '0');
      }, 0);
      setTotalKas(total);
    };
  
    fetchKas();
  }, [user]);
  
  return (
    <IonLabel style={{ display: 'block', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
      <IonText>Kas Masuk: Rp {totalKas.toLocaleString('id-ID')}</IonText>
    </IonLabel>
  );
};

export default TotalKasMasuk;
