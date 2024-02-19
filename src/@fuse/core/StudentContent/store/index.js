import { combineReducers } from '@reduxjs/toolkit';
import student from './studentSlice';

const reducer = combineReducers({
  
  student,
});

export default reducer;
