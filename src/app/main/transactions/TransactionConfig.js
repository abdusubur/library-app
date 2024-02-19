import i18next from 'i18next';

import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import { lazy } from 'react';


i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const Transaction = lazy(() => import('./Transaction'));
const TransactionDetails = lazy(() => import('./TransactionDetails'));

const BooksConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'transaction',
      element: <Transaction />,
    },
    {
      path: '/transaction/:transactionId/*',
      element: <TransactionDetails />,
    },
  ],
};

export default BooksConfig;
