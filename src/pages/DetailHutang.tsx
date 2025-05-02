import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonCard, IonModal, IonInput,
  IonIcon, IonListHeader, IonBackButton, IonButton, IonButtons, IonSpinner, IonAlert, IonLoading,
  IonNote,
  IonCardContent,
  IonFooter
} from '@ionic/react';
import { useToast } from '../contexts/useToast';
import { logoWhatsapp, pencilSharp, trashSharp } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

const DetailHutang: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [showWaAlert, setShowWaAlert] = useState(false);
  const [bayarAlert, setBayarAlert] = useState(false);
  const [deleteUser, setDeleteAlert] = useState(false);
  const [loadingBayar, setLoadingBayar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNama, setEditNama] = useState('');
  const [editJumlah, setEditJumlah] = useState(0);
  const [editJatuhTempo, setEditJatuhTempo] = useState('');
  const user = getAuth().currentUser;
  const { show } = useToast();


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
        const docData = docSnap.data();
        setData({ id: docSnap.id, ...docData });
      
        // 📝 Set nilai default untuk form edit
        setEditNama(docData.nama || '');
        setEditJumlah(parseInt(docData.jumlah) || 0);
        if (docData.jatuhTempo instanceof Timestamp) {
          const date = docData.jatuhTempo.toDate();
          setEditJatuhTempo(date.toISOString().split('T')[0]);
        } else if (typeof docData.jatuhTempo === 'string') {
          const parsedDate = new Date(docData.jatuhTempo);
          if (!isNaN(parsedDate.getTime())) {
            setEditJatuhTempo(parsedDate.toISOString().split('T')[0]);
          } else {
            setEditJatuhTempo('');
          }
        } else {
          setEditJatuhTempo('');
        }
              }
            setLoading(false);
    };
    fetchData();
  }, [id]);
  
  const handleBayarPenuh = async () => {
    setBayarAlert(true);
  };

  const bayarPenuhSubmit = async () => {
    if (!data) return;
    setLoadingBayar(true);
  
    try {
      const user = getAuth().currentUser;
      if (!user) return;
  
      await addDoc(collection(db, 'kasMasuk'), {
        uid: user.uid,
        nama: data.nama,
        jumlah: data.jumlah,
        tanggal: Timestamp.now(),
        jatuhTempo: Timestamp.now(),
        keterangan: 'Bayar penuh'
      });
  
      await deleteDoc(doc(db, 'hutang', id));
  
      history.push('/dashboard');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    } catch (err) {
      console.error('Gagal bayar penuh:', err);
    } finally {
      setLoadingBayar(false);
    }
  };
  
  const handleBayarCicil = async () => {
    setShowAlert(true);
  };

  const handleCicilSubmit = async (jumlahCicilan: number) => {
    if (!data) return;
    setLoadingBayar(true);
  
    try {
      const user = getAuth().currentUser;
      if (!user) return;
  
      const sisa = data.jumlah - jumlahCicilan;
  
      await addDoc(collection(db, 'kasMasuk'), {
        uid: user.uid,
        nama: data.nama,
        jumlah: jumlahCicilan,
        tanggal: Timestamp.now(),
        jatuhTempo: Timestamp.now(),
        keterangan: 'Cicilan'
      });
  
      await addDoc(collection(db, `hutang/${id}/pembayaran`), {
        uid: user.uid,
        jumlah: jumlahCicilan,
        tanggal: Timestamp.now(),
        jatuhTempo: Timestamp.now(),
        metode: 'Cicilan'
      });
  
      await updateDoc(doc(db, 'hutang', id), {
        jumlah: sisa
      });
  
      setShowAlert(false);
      history.push('/dashboard');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error('Gagal bayar cicil:', err);
    } finally {
      setLoadingBayar(false);
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'hutang', id), {
        nama: editNama,
        jumlah: editJumlah,
        jatuhTempo: Timestamp.fromDate(new Date(editJatuhTempo)),
      });
      show('Hutang berhasil diperbarui!', 'success');
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      show('Gagal update hutang', 'danger');
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    }
  };
  
  const handleDeleteAlert = async () => {
    setDeleteAlert(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteDoc(doc(db, 'hutang', id));
      history.push('/dashboard');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
      show('Hutang berhasil dihapus!', 'success');
    } catch (err) {
      console.error('Gagal hapus hutang:', err);
      show('Gagal hapus hutang!', 'danger');
    }
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
        {loading ? (            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
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
        <IonButtons slot="end">
        <IonButton color="warning" onClick={() => setShowEditModal(true)} title="Edit Hutang">
        <IonIcon slot="icon-only" icon={pencilSharp} />
        </IonButton>
        </IonButtons>
        <IonButtons slot="end">
            <IonButton color="danger" onClick={handleDeleteAlert} title="Hapus Hutang">
                <IonIcon slot="icon-only" icon={trashSharp} />
            </IonButton>
        </IonButtons>
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
                  <IonCard>
			<IonItem color="light" key={idx} lines="full">
			  <IonLabel>
				<h2 style={{ fontSize: '1rem', margin: 0 }}>Bayar Rp {parseInt(item.jumlah).toLocaleString('id-ID')}</h2>
        <br/>
				<p style={{ fontSize: '0.8rem', color: '#fff' }}><IonNote>Tanggal -   
				  {item.tanggal && item.tanggal.toDate
					? item.tanggal.toDate().toLocaleDateString('id-ID')
					: 'Tanggal tidak valid'}
				</IonNote></p>
			  </IonLabel>
			</IonItem>
      </IonCard>
		  ))
		)}
    <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Hutang {data.nama}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowEditModal(false)}>Cancel</IonButton>
                  </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
              <IonInput label="Nama" labelPlacement="fixed" placeholder="Edit Nama" value={editNama} onIonChange={e => setEditNama(e.detail.value!)} />
              <IonInput label="Edit Jumlah" type="number" labelPlacement="fixed" placeholder="Edit Jumlah Hutang" value={editJumlah} onIonChange={e => setEditJumlah(parseInt(e.detail.value!))} />
              <IonInput label="Jatuh Tempo" type="date" labelPlacement="fixed" placeholder="Edit Jatuh tempo" value={editJatuhTempo} onIonChange={e => setEditJatuhTempo(e.detail.value!)} />
          </IonCardContent>
          <IonFooter>
            <IonToolbar className='ion-padding'>
              <IonButton expand="block" onClick={handleEditSubmit}>Simpan</IonButton>
            </IonToolbar>
          </IonFooter>
        </IonCard>
      </IonContent>
    </IonModal>    
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
        <IonAlert
        isOpen={deleteUser}
        header="Konfirmasi"
        message="Apakah kamu yakin ingin menghapusnya?"
        buttons={[
          {
            text: 'Batal',
            role: 'cancel',
            handler: () => setDeleteAlert(false),
          },
          {
            text: 'Yakin',
            handler: () => {
              setDeleteAlert(false);
              handleDeleteSubmit();
            },
          },
        ]}
      />
      </IonContent>
<IonAlert
  isOpen={bayarAlert}
  header="Konfirmasi"
  message="Apakah yang bersangkutan sudah membayar sepenuhnya?"
  buttons={[
    {
      text: 'Belum',
      role: 'cancel',
      handler: () => setBayarAlert(false),
    },
    {
      text: 'Sudah',
      handler: () => {
        setBayarAlert(false);
        bayarPenuhSubmit();
      },
    },
  ]}
/>
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
        handleKirimWhatsapp();
      },
    },
  ]}
/>
<IonLoading
  isOpen={loadingBayar}
  message="Memproses pembayaran..."
  spinner="crescent"
/>
    </IonPage>
  );
};

export default DetailHutang;
function setDeleteAlert(arg0: boolean) {
  throw new Error('Function not implemented.');
}

