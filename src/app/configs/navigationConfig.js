import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'student-component',
    title: 'Student',
    translate: 'student',
    type: 'item',
    url: 'student',
  },
  {
    id: 'books-component',
    title: 'Books',
    translate: 'books',
    type: 'item',
    url: 'books',
  },
  {
    id: 'transaction-component',
    title: 'Transaction',
    translate: 'transaction',
    type: 'item',
    url: 'transaction',
  },
];

export default navigationConfig;
