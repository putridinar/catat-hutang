// src/components/TotalKasMasuk.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { IonLabel, IonText } from '@ionic/react';

const TotalKasMasuk: React.FC = () => {
  const [totalKas, setTotalKas] = useState(0);

  useEffect(() => {
    const fetchKas = async () => {
      const snapshot = await getDocs(collection(db, 'kasMasuk'));
      const total = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + parseInt(data.jumlah || '0');
      }, 0);
      setTotalKas(total);
    };
    fetchKas();
  }, []);

  return (
    <IonLabel style={{ display: 'block', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>
      <IonText>Kas Masuk: Rp {totalKas.toLocaleString('id-ID')}</IonText>
    </IonLabel>
  );
};

export default TotalKasMasuk;
