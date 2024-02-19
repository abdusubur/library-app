import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FuseUtils from "@fuse/utils";

export const getBookById = createAsyncThunk(
  "bookApp/getBook",
  async (bookId) => {
    const response = await axios.get(`/api/books/${bookId}`);
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const removeBook = createAsyncThunk(
  "bookApp/removeBook",
  async (val, { dispatch, getState }) => {
    const { id } = getState().bookApp.book;
    await axios.delete(`/api/books/${id}`);
    return id;
  }
);

export const saveBook = createAsyncThunk(
  "bookApp/saveBook",
  async (booksData, { dispatch, getState }) => {
    const { id } = getState().bookApp.book;
    const response = await axios.put(
      `/api/books/${id}`,
      booksData
      );
      console.log("saveBook ID :", booksData)
    const data = await response.data;
    return data;
  }
);

export const createBook = createAsyncThunk(
  "bookApp/createBook",
  async (booksData, { dispatch, getState }) => {
    const { id } = getState().bookApp.book;
    const response = await axios.post(
      `/api/books/${id}`,
      booksData
    );

    const data = await response.data;
    return data;
  }
);

const bookSlice = createSlice({
  name: "bookApp",
  initialState: null,
  reducers: {
    resetBook: () => null,
    newBook: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: "",
          adi: "",
          resim: "",
          isbnno: "",
          barkodno: "",
          yazar: "",
          yayinevi: "",
        },
      }),
    },
  },
  extraReducers: {
    [getBookById.fulfilled]: (state, action) => action.payload,
    [saveBook.fulfilled]: (state, action) => action.payload,
    [createBook.fulfilled]: (state, action) => action.payload,
    [removeBook.fulfilled]: (state, action) => null,
  },
});

export const { newBook, resetBook } = bookSlice.actions;

export const selectBook = ({ bookApp }) => bookApp;

export default bookSlice.reducer;
