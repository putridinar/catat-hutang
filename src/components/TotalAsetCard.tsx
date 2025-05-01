// src/components/TotalAsetCard.tsx
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText } from '@ionic/react';

const TotalAsetCard: React.FC = () => {
  const [kasMasuk, setKasMasuk] = useState(0);
  const [piutang, setPiutang] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeKas = onSnapshot(collection(db, 'kasMasuk'), (snapshot) => {
      const total = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + parseInt(data.jumlah || '0');
      }, 0);
      setKasMasuk(total);
    });

    const unsubscribePiutang = onSnapshot(collection(db, 'hutang'), (snapshot) => {
      const total = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + parseInt(data.jumlah || '0');
      }, 0);
      setPiutang(total);
      setLoading(false); // selesai loading pas piutang masuk (terakhir)
    });

    return () => {
      unsubscribeKas();
      unsubscribePiutang();
    };
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