// Dashboard.tsx (Page utama)
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonFab, IonFabButton, IonIcon, IonSpinner, IonMenuButton,  IonButtons, IonToast
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import TotalHutang from '../components/TotalHutang';
import TotalKasMasuk from '../components/TotalKasMasuk';
import PiutangList from '../components/PiutangList';
import TambahModal from '../components/TambahModal';

interface Piutang {
  id: string;
  nama: string;
  jumlah: string;
  tanggal: string;
  catatan?: string;
  noHp?: string;
}

const Dashboard: React.FC = () => {
  const [piutangList, setPiutangList] = useState<Piutang[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  // Form state
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [noHp, setNoHp] = useState('');

  const fetchPiutang = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'hutang'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Piutang, 'id'>),
      }));
      setPiutangList(data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPiutang();
  }, []);

  const handleSubmit = async () => {
    if (!nama || !noHp || !jumlah || !tanggal) {
      setShowToast(true);
      return;
    }

    try {
      await addDoc(collection(db, 'hutang'), {
        nama,
        jumlah,
        tanggal,
        catatan,
        noHp,
      });
      modal.current?.dismiss();
      await fetchPiutang();
      setNama('');
      setJumlah('');
      setTanggal('');
      setCatatan('');
      setNoHp('');
    } catch (err) {
      console.error('Gagal simpan:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setShowToast(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500); // delay biar toast sempat tampil
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          <IonTitle>Daftar Piutang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => modal.current?.present()}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

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
          <>
			<TotalKasMasuk />
            <TotalHutang data={piutangList} />
            <PiutangList data={piutangList} />
          </>
        )}

        <TambahModal
          modalRef={modal}
          nama={nama} setNama={setNama}
          noHp={noHp} setNoHp={setNoHp}
          jumlah={jumlah} setJumlah={setJumlah}
          tanggal={tanggal} setTanggal={setTanggal}
          catatan={catatan} setCatatan={setCatatan}
          onSubmit={handleSubmit}
        />

        <IonToast
          isOpen={showToast}
          message="Nama, nomor HP, jumlah, dan tanggal wajib diisi!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
