// components/TotalHutang.tsx
import { IonItem, IonLabel } from '@ionic/react';

interface Props {
  data: { jumlah: string }[];
}

const TotalHutang: React.FC<Props> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + parseFloat(item.jumlah || '0'), 0);

  return (
    <IonItem lines="full">
      <IonLabel>
        <h2>Total Hutang</h2>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          Rp {total.toLocaleString('id-ID')}
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default TotalHutang;
