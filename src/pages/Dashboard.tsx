import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonModal, IonInput, IonTextarea, IonToast, IonDatetime, IonDatetimeButton, IonSpinner
} from '@ionic/react';
import { useEffect, useState, useRef } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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
  const modal = useRef<HTMLIonModalElement>(null);

  // Form state
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [noHp, setNoHp] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Ambil data dari Firestore
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
      modal.current?.dismiss(); // Tutup modal
      await fetchPiutang(); // Refresh data
      setNama('');
      setJumlah('');
      setTanggal('');
      setCatatan('');
      setNoHp('');
    } catch (err) {
      console.error('Gagal simpan:', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Daftar Piutang</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => modal.current?.present()}>
          Tambah Hutang
        </IonButton>

        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
		<IonList>
		  {piutangList.map((item) => (
			<IonItem key={item.id}>
			  <IonLabel>
				<h2>{item.nama}</h2>
				<p>Hutang: Rp {item.jumlah}</p>
<p>
  Tanggal:{" "}
  {item.tanggal && typeof item.tanggal.toDate === 'function'
    ? item.tanggal.toDate().toLocaleDateString('id-ID')
    : new Date(item.tanggal).toLocaleDateString('id-ID')}
</p>
			  </IonLabel>
			</IonItem>
		  ))}
		</IonList>
        )}

        <IonModal ref={modal}>
          <IonContent className="ion-padding">
            <h2>Tambah Hutang</h2>
        <IonItem lines='none'>
          <IonInput label="Nama" label-placement="floating" clear-input="true" fill="outline" value={nama} onIonChange={(e) => setNama(e.detail.value!)}
		style={{ margin: '10px 0', padding: '12px', width: '100%', borderRadius: '8px', border: '0px solid #ccc' }} />
        </IonItem>

        <IonItem lines='none'>
          <IonInput label="Nomor HP" label-placement="floating" clear-input="true" fill="outline" value={noHp} onIonChange={(e) => setNoHp(e.detail.value!)}
		style={{ margin: '10px 0', padding: '12px', width: '100%', borderRadius: '8px', border: '0px solid #ccc' }} />
        </IonItem>

        <IonItem lines='none'>
          <IonInput label="Pinjaman (Rp)" label-placement="floating" clear-input="true" fill="outline" type="number" value={jumlah} onIonChange={(e) => setJumlah(e.detail.value!)}
			style={{ margin: '10px 0', padding: '12px', width: '100%', borderRadius: '8px', border: '0px solid #ccc' }} />
        </IonItem>

        <IonItem lines='none'>
          <IonTextarea label="Catatan" label-placement="floating" clear-input="true" fill="outline" value={catatan} onIonChange={(e) => setCatatan(e.detail.value!)}
			style={{ margin: '10px 0' }} />
        </IonItem>

<IonItem lines='none'>
  <IonLabel position="stacked">Tanggal</IonLabel>
  <input
    type="date"
    value={tanggal}
    onChange={(e) => setTanggal(e.target.value)}
    style={{ margin: '10px 0', padding: '12px', width: '100%', borderRadius: '3px', border: '1px solid #595959', background: 'inherit' }}
  />
</IonItem>

            <IonButton expand="block" onClick={handleSubmit}>Simpan</IonButton>
            <IonButton expand="block" color="medium" onClick={() => modal.current?.dismiss()}>
              Batal
            </IonButton>
          </IonContent>
        </IonModal>

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
