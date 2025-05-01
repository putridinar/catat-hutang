import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText } from '@ionic/react';

const TotalAsetCard: React.FC = () => {
  const [kasMasuk, setKasMasuk] = useState(0);
  const [piutang, setPiutang] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      if (!user) return;
  
      const qKas = query(collection(db, 'kasMasuk'), where('uid', '==', user.uid));
      const qHutang = query(collection(db, 'hutang'), where('uid', '==', user.uid));
  
      const unsubscribeKas = onSnapshot(qKas, (snapshot) => {
        const total = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + parseInt(data.jumlah || '0');
        }, 0);
        setKasMasuk(total);
      });
  
      const unsubscribePiutang = onSnapshot(qHutang, (snapshot) => {
        const total = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + parseInt(data.jumlah || '0');
        }, 0);
        setPiutang(total);
        setLoading(false);
      });
  
      // Cleanup snapshot
      return () => {
        unsubscribeKas();
        unsubscribePiutang();
      };
    });
  
    // Cleanup auth listener
    return () => unsubscribeAuth();
  }, []);

  const totalAset = kasMasuk + piutang;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Total Aset</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {loading ? (
          <IonText color="medium">Menghitung aset...</IonText>
        ) : (
          <>
            <p>💰 Kas Masuk: <strong>Rp {kasMasuk.toLocaleString('id-ID')}</strong></p>
            <p>🧾 Piutang: <strong>Rp {piutang.toLocaleString('id-ID')}</strong></p>
            <hr />
            <p>🧮 Total Aset: <strong>Rp {totalAset.toLocaleString('id-ID')}</strong></p>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TotalAsetCard;