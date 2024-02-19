import SignInPage from './SignInPage';
import authRoles from '../../auth/authRoles';
import ModernSignInPage from './ModernSignInPage';

const SignInConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'sign-in',
      element: <ModernSignInPage />,
    },
  ],
};

export default SignInConfig;
