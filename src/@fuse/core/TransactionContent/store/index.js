import { combineReducers } from '@reduxjs/toolkit';
import transaction from './TransactionSlice';

const reducer = combineReducers({
  
  transaction,
});

export default reducer;
