import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FusePageSimple from '@fuse/core/FusePageSimple';
import BooksContentDetails from '@fuse/core/BooksContent/BooksContentDetails';


const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function BooksPage(props) {
  const { t } = useTranslation('examplePage');

  return (
    <Root
      // header={
      //   <div className="p-24">
      //     <h4>{t('TITLE')}</h4>
      //   </div>
      // }
      content={
        <div className="p-24">
          <BooksContentDetails />
        </div>
      }
      scroll="content"
    />
  );
}

export default BooksPage;
