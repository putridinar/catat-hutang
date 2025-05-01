// src/pages/RiwayatTransaksi.tsx
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonList, IonSpinner, IonButtons, IonBackButton
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../firebase';
  
  interface Transaksi {
    nama: string;
    jumlah: number;
    tanggal: any;
    keterangan: string;
  }
  
  const RiwayatTransaksi: React.FC = () => {
    const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchTransaksi = async () => {
        const snapshot = await getDocs(collection(db, 'kasMasuk'));
        const data = snapshot.docs.map(doc => {
          const item = doc.data();
          return {
            nama: item.nama,
            jumlah: parseInt(item.jumlah),
            tanggal: item.tanggal?.toDate(),
            keterangan: item.keterangan || 'Pemasukan'
          };
        });
        setTransaksi(data.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime()));
        setLoading(false);
      };
  
      fetchTransaksi();
    }, []);
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/dashboard" />
            </IonButtons>
            <IonTitle>Riwayat Transaksi</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <IonSpinner name="crescent" />
            </div>
          ) : (
            <IonList>
              {transaksi.map((trx, idx) => (
                <IonItem key={idx}>
                  <IonLabel>
                    <h2>{trx.nama}</h2>
                    <p>{trx.keterangan} - {trx.tanggal.toLocaleDateString('id-ID')}</p>
                  </IonLabel>
                  <IonLabel slot="end" color="success" style={{ textAlign: 'right' }}>
                    <h2>Rp {trx.jumlah.toLocaleString('id-ID')}</h2>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonContent>
      </IonPage>
    );
  };
  
  export default RiwayatTransaksi;  