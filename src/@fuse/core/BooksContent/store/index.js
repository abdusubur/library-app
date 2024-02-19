import { combineReducers } from '@reduxjs/toolkit';
import book from './bookSlice';

const reducer = combineReducers({
  
  book,
});

export default reducer;
