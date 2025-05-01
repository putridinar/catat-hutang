// components/PiutangList.tsx
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { chevronForward } from 'ionicons/icons';

interface Props {
  data: {
    id: string;
    nama: string;
    jumlah: string;
    tanggal: string;
    jatuhTempo: string;
  }[];
}

const PiutangList: React.FC<Props> = ({ data }) => {
  const history = useHistory();

  return (
    <IonList style={{ marginTop: '16px', background: 'transparent' }}>
      {data.map((item) => (
        <IonItem
          lines="none"
          button
          onClick={() => history.push(`/detail/${item.id}`)}
          key={item.id}
          style={{
            marginBottom: '12px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            '--background': 'linear-gradient(135deg, #f4f5f8, #ffffff)'
          }}
        >
          <IonLabel>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px', color: '#222' }}>
              {item.nama}
            </h2>
            <p style={{ margin: '2px 0', color: '#444' }}>
              💰 <strong>Hutang:</strong> Rp {parseInt(item.jumlah).toLocaleString('id-ID')}
            </p>
            <p style={{ margin: '2px 0', color: '#666' }}>
              📅 <strong>Tanggal:</strong> {new Date(item.tanggal).toLocaleDateString('id-ID')}
            </p>
            <p style={{ margin: '2px 0', color: '#666' }}>
              💥 <strong>Tempo:</strong> {new Date(item.jatuhTempo).toLocaleDateString('id-ID')}
            </p>
          </IonLabel>
          <IonIcon icon={chevronForward} slot="end" color="medium" />
        </IonItem>
      ))}
    </IonList>
  );
};

export default PiutangList;