import i18next from 'i18next';

import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import { lazy } from 'react';


i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const Books = lazy(() => import('./Books'));
const BooksDetails = lazy(() => import('./BooksDetails'));

const BooksConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'books',
      element: <Books />,
    },
    {
      path: '/books/:booksId/*',
      element: <BooksDetails />,
    },
  ],
};

export default BooksConfig;
