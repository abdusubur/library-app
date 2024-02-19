import SignUpPage from './SignUpPage';
import authRoles from '../../auth/authRoles';
import ModernSignUpPage from './ModernSignUpPage';
import ModernSignUpStepsPage from './ModernSignUpStepsPage';

const SignUpConfig = {
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
      path: 'sign-up',
      element: <ModernSignUpStepsPage/>,
    },
  ],
};

export default SignUpConfig;
