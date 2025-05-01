import {
  IonContent,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from '@ionic/react';
import { useToast } from '../contexts/useToast';
import { useLocation } from 'react-router-dom';
import {
  logOutOutline, logOutSharp, personOutline, personSharp,
  clipboardOutline, clipboardSharp, barChartOutline, barChartSharp
} from 'ionicons/icons';
import UserProfileItem from '../components/UserProfileItem';
import TotalAsetCard from '../components/TotalAsetCard';

import './Menu.css';

interface AppPage {
  title: string;
  url: string;
  iosIcon: string;
  mdIcon: string;
  isLogout?: boolean;
}

const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    iosIcon: clipboardOutline,
    mdIcon: clipboardSharp,
  },
  {
    title: 'Profile',
    url: '/profile',
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
  {
    title: 'Riwayat Transaksi',
    url: '/riwayat',
    iosIcon: barChartOutline,
    mdIcon: barChartSharp,
  },
  {
    title: 'Logout',
    url: '',
    iosIcon: logOutOutline,
    mdIcon: logOutSharp,
    isLogout: true,
  },
];

interface MenuProps {
  className?: string;
}

const Menu: React.FC<MenuProps> = ({ className }) => {
  const location = useLocation();
  const { show } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('uid');
    show('Logout berhasil!', 'success');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000); // beri delay biar toast sempat tampil
  };

  return (
    <IonMenu className={className} contentId="main" type="overlay">
      <IonContent>
      <UserProfileItem />
        <IonList id="menu-list">
          <IonListHeader>Menu</IonListHeader>

          {appPages.map((appPage, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                button
                onClick={
                  appPage.isLogout
                    ? handleLogout
                    : () => (window.location.href = appPage.url)
                }
                className={location.pathname === appPage.url ? 'selected' : ''}
                lines="none"
                detail={false}
              >
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={appPage.iosIcon}
                  md={appPage.mdIcon}
                />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
        <IonFooter>
          <IonToolbar>
          <TotalAsetCard />
        </IonToolbar>
        </IonFooter>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;