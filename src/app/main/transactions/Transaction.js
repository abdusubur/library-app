import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FusePageSimple from '@fuse/core/FusePageSimple';
import TransactionContent from '@fuse/core/TransactionContent';


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

function TransactionPage(props) {
  const { t } = useTranslation('examplePage');

  return (
    <Root
      // header={
      //   <div className="p-24">
      //     <h4>{t('TITLE')}</h4>
      //   </div>
      // }
      content={
        <div className="p-24 w-full sm:w-2xl md:w-6xl">
          <TransactionContent/>
        </div>
      }
      scroll="content"
    />
  );
}

export default TransactionPage;
