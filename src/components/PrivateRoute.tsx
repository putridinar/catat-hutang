// src/components/PrivateRoute.tsx
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
