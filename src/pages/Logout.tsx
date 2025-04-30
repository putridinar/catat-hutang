// src/pages/Logout.tsx
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { logoutUser } from '../auth';

const Logout: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const doLogout = async () => {
      await logoutUser();
      history.replace('/login');
    };

    doLogout();
  }, [history]);

  return null;
};

export default Logout;
