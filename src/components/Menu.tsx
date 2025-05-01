import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';
import { useToast } from '../useToast';
import { useLocation } from 'react-router-dom';
import {
  logOutOutline, logOutSharp,
  clipboardOutline, clipboardSharp
} from 'ionicons/icons';

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
    title: 'Logout',
    url: '',
    iosIcon: logOutOutline,
    mdIcon: logOutSharp,
    isLogout: true,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();
  const { show } = useToast(); // aman karena tidak dipanggil saat render

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    show('Logout berhasil!', 'success'); // panggil toast
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000); // beri delay biar toast sempat tampil
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
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
      </IonContent>
    </IonMenu>
  );
};

export default Menu;