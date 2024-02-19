import i18next from 'i18next';

import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import { lazy } from 'react';


i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const Student = lazy(() => import('./Student'));
const StudentDetails = lazy(() => import('./StudentDetails'));

const BooksConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'student',
      element: <Student />,
    },
    {
      path: '/student/:studentId/*',
      element: <StudentDetails />,
    },
  ],
};

export default BooksConfig;
