// components/TambahModal.tsx
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonInput, IonTextarea, IonLabel, IonFooter, IonButtons, IonButton
} from '@ionic/react';
import { RefObject } from 'react';

interface Props {
  modalRef: RefObject<HTMLIonModalElement>;
  nama: string;
  setNama: (val: string) => void;
  noHp: string;
  setNoHp: (val: string) => void;
  jumlah: string;
  setJumlah: (val: string) => void;
  tanggal: string;
  setTanggal: (val: string) => void;
  catatan: string;
  setCatatan: (val: string) => void;
  onSubmit: () => void;
}

const TambahModal: React.FC<Props> = ({
  modalRef, nama, setNama, noHp, setNoHp, jumlah, setJumlah,
  tanggal, setTanggal, catatan, setCatatan, onSubmit
}) => {
  return (
    <IonModal ref={modalRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tambah Piutang</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
<IonItem lines="none" style={{ '--background': 'transparent', overflow: 'visible', marginBottom: '20px' }}>
  <IonInput label="Nama" label-placement="floating" fill="outline" value={nama} onIonChange={(e) => setNama(e.detail.value!)} />
</IonItem>

<IonItem lines="none" style={{ '--background': 'transparent', overflow: 'visible', marginBottom: '20px' }}>
  <IonInput label="Nomor HP" label-placement="floating" fill="outline" value={noHp} onIonChange={(e) => setNoHp(e.detail.value!)} />
</IonItem>

<IonItem lines="none" style={{ '--background': 'transparent', overflow: 'visible', marginBottom: '20px' }}>
  <IonInput label="Pinjaman (Rp)" label-placement="floating" type="number" fill="outline" value={jumlah} onIonChange={(e) => setJumlah(e.detail.value!)} />
</IonItem>

<IonItem lines="none" style={{ '--background': 'transparent', overflow: 'visible', marginBottom: '20px' }}>
  <IonTextarea label="Catatan" label-placement="floating" fill="outline" value={catatan} onIonChange={(e) => setCatatan(e.detail.value!)} />
</IonItem>

<IonItem lines="none" style={{ '--background': 'transparent', overflow: 'visible', marginBottom: '20px' }}>
  <IonLabel position="stacked">Tanggal</IonLabel>
  <input
    type="date"
    value={tanggal}
    onChange={(e) => setTanggal(e.target.value)}
    style={{
      marginTop: '8px',
      padding: '12px',
      width: '100%',
      borderRadius: '3px',
      border: '1px solid #595959',
      background: 'inherit'
    }}
  />
</IonItem>

      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={onSubmit}>Simpan</IonButton>
          </IonButtons>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => modalRef.current?.dismiss()}>
              Batal
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default TambahModal;