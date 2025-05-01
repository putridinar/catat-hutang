import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem,
  IonIcon, IonListHeader, IonBackButton, IonButton, IonButtons, IonSpinner, IonAlert
} from '@ionic/react';
import { logoWhatsapp } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DetailHutang: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [showWaAlert, setShowWaAlert] = useState(false);

useEffect(() => {
  const fetchHistory = async () => {
    const snapshot = await getDocs(collection(db, `hutang/${id}/pembayaran`));
    const data = snapshot.docs.map((doc) => doc.data());
    setRiwayat(data);
  };

  fetchHistory();
}, [id]);

useEffect(() => {
  const fetchHistory = async () => {
    const snapshot = await getDocs(collection(db, `hutang/${id}/pembayaran`));
    const data = snapshot.docs.map((doc) => doc.data());
    setRiwayat(data);
  };
  fetchHistory();
}, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const docRef = doc(db, 'hutang', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleBayarPenuh = async () => {
    if (!data) return;
    // Simpan ke kas masuk (implementasikan koleksi 'kasMasuk')
    await addDoc(collection(db, 'kasMasuk'), {
      nama: data.nama,
      jumlah: data.jumlah,
      tanggal:  Timestamp.now(),
      keterangan: 'Bayar penuh'
    });
    await deleteDoc(doc(db, 'hutang', id));
    history.push('/dashboard');
  };

  const handleBayarCicil = async () => {
    setShowAlert(true);
  };

  const handleCicilSubmit = async (jumlahCicilan: number) => {
    if (!data) return;
    const sisa = parseInt(data.jumlah) - jumlahCicilan;

    // Masukkan cicilan ke kasMasuk
    await addDoc(collection(db, 'kasMasuk'), {
      nama: data.nama,
      jumlah: jumlahCicilan,
      tanggal:  Timestamp.now(),
      keterangan: 'Cicilan'
    });
	
	await addDoc(collection(db, `hutang/${id}/pembayaran`), {
	  jumlah: jumlahCicilan,
	  tanggal:  Timestamp.now(),
	  metode: 'Cicilan'
	});

    // Update hutang
    await updateDoc(doc(db, 'hutang', id), {
      jumlah: sisa.toString()
    });

    setShowAlert(false);
    history.push('/dashboard');
  };

  const handleKirimWhatsapp = () => {
    if (!data) return;
  
    const nama = data.nama;
    const jumlah = parseInt(data.jumlah).toLocaleString('id-ID');
    const tanggalPinjam = data.tanggal?.toDate?.() || new Date(data.tanggal);
    const tanggalJatuhTempo = data.jatuhTempo?.toDate?.() || new Date(data.jatuhTempo);
    const noHp = data.noHp?.replace(/^0/, '62'); // ubah 08xxx jadi 628xxx
  
    const pesan = `Halo ${nama},\n\nKami ingin mengingatkan mengenai pinjaman Anda sebesar Rp ${jumlah}.\n\n🗓 Tanggal Pinjam: ${tanggalPinjam.toLocaleDateString('id-ID')}\n📅 Jatuh Tempo: ${tanggalJatuhTempo.toLocaleDateString('id-ID')}\n\nSilakan lakukan pembayaran ke rekening berikut:\n\n💳 BCA - 1234567890 a/n PT. Sari AMD\n📱 DANA - 0812-xxxx-xxxx\n\nMohon konfirmasi jika sudah melakukan pembayaran. Terima kasih 🙏`;
  
    const url = `https://wa.me/${noHp}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  };
   
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Detail Piutang</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowWaAlert(true)} title="Kirim tagihan WhatsApp">
              <IonIcon slot="icon-only" icon={logoWhatsapp} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40%' }}>
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
			<IonItem lines="none" style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
			  <IonLabel>
				<h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>{data.nama}</h2>
				<p style={{ margin: '4px 0' }}>💰 <strong>Jumlah:</strong> Rp {parseInt(data.jumlah).toLocaleString('id-ID')}</p>
				<p style={{ margin: '4px 0' }}>📱 <strong>Nomor HP:</strong> {data.noHp}</p>
				<p style={{ margin: '4px 0' }}>📝 <strong>Catatan:</strong> {data.catatan || '-'}</p>
			  </IonLabel>
			</IonItem>

			<div style={{ display: 'flex', gap: '12px', flexDirection: 'column', marginTop: '20px' }}>
			  <IonButton color="success" expand="block" shape="round" style={{ fontWeight: 'bold' }} onClick={handleBayarPenuh}>
				💸 Bayar Penuh
			  </IonButton>
			  <IonButton color="warning" expand="block" shape="round" style={{ fontWeight: 'bold' }} onClick={handleBayarCicil}>
				🧾 Bayar Cicil
			  </IonButton>
			</div>
		
		<IonListHeader style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
		  Riwayat Pembayaran
		</IonListHeader>
		{riwayat.length === 0 ? (
		  <IonItem color="light">
			<IonLabel color="medium">Belum ada pembayaran tercatat.</IonLabel>
		  </IonItem>
		) : (
		  riwayat.map((item, idx) => (
			<IonItem color="tertiary" key={idx} lines="full">
			  <IonLabel>
				<h2 style={{ fontSize: '1rem', margin: 0 }}>Rp {parseInt(item.jumlah).toLocaleString('id-ID')}</h2>
				<p style={{ fontSize: '0.8rem', color: '#666' }}>
				  {item.tanggal && item.tanggal.toDate
					? item.tanggal.toDate().toLocaleDateString('id-ID')
					: 'Tanggal tidak valid'}
				</p>
			  </IonLabel>
			</IonItem>
		  ))
		)}
          </>
        )}
        <IonAlert
          isOpen={showAlert}
          header="Bayar Cicilan"
          inputs={[
            {
              name: 'jumlah',
              type: 'number',
              placeholder: 'Masukkan jumlah cicilan',
            },
          ]}
          buttons={[
            {
              text: 'Batal',
              role: 'cancel',
              handler: () => setShowAlert(false),
            },
            {
              text: 'Bayar',
              handler: (data) => handleCicilSubmit(parseInt(data.jumlah)),
            },
          ]}
        />
      </IonContent>
<IonAlert
  isOpen={showWaAlert}
  header="Konfirmasi"
  message="Kirim penagihan hutang via WhatsApp?"
  buttons={[
    {
      text: 'Batal',
      role: 'cancel',
      handler: () => setShowWaAlert(false),
    },
    {
      text: 'Kirim',
      handler: () => {
        setShowWaAlert(false);
        handleKirimWhatsapp(); // kirim pesan
      },
    },
  ]}
/>
    </IonPage>
  );
};

export default DetailHutang;
