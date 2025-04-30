import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonToast
} from '@ionic/react';
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Dashboard: React.FC = () => {
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString());
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [catatan, setCatatan] = useState('');
  const [showToast, setShowToast] = useState(false);

const handleSubmit = async () => {
  if (!nama || !jumlah || !tanggal) {
    setShowToast(true);
    return;
  }

  try {
    await addDoc(collection(db, "hutang"), {
		id,
      nama,
      noHp,
      jumlah: Number(jumlah),
      catatan,
      tanggal: new Date(tanggal)
    });

    alert("Tersimpan ke Firebase!");

    // Reset form
    setNama("");
    setNoHp("");
    setJumlah("");
    setCatatan("");
    setTanggal("");
  } catch (error) {
    console.error("Gagal menyimpan ke Firestore:", error);
    alert("Gagal menyimpan data!");
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Catat Hutang</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nama</IonLabel>
          <IonInput value={nama} onIonChange={(e) => setNama(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Nomor HP (opsional)</IonLabel>
          <IonInput value={noHp} onIonChange={(e) => setNoHp(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Jumlah (Rp)</IonLabel>
          <IonInput type="number" value={jumlah} onIonChange={(e) => setJumlah(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Catatan</IonLabel>
          <IonTextarea value={catatan} onIonChange={(e) => setCatatan(e.detail.value!)} />
        </IonItem>

        <IonItem lines="none">
          <IonLabel>Tanggal</IonLabel>
          <IonDatetimeButton datetime="selectTanggal" />
        </IonItem>

        <IonModal keepContentsMounted={true}>
          <IonDatetime
            id="selectTanggal"
            presentation="date"
            value={tanggal}
            onIonChange={(e) => setTanggal(e.detail.value!)}
          />
        </IonModal>

        <IonButton expand="block" className="ion-margin-top" onClick={handleSubmit}>
          Simpan
        </IonButton>

        <IonToast
          isOpen={showToast}
          message="Nama, jumlah, dan tanggal wajib diisi!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
