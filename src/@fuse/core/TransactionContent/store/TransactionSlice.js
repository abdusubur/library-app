import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FuseUtils from "@fuse/utils";

export const getTransactionByNumber = createAsyncThunk(
  "transactionApp/getTransactionByNumber",
  async (ogrNo) => {
    const response = await axios.get("transactionApp/getTransactionByNumber");
    console.log("Transaction DB :", ogrNo," data :", response)
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const getTransactionById = createAsyncThunk(
  "transactionApp/getTransaction",
  async (transactionId) => {
    console.log("Hello")
    const response = await axios.get(`/api/transaction/${transactionId}`);
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const removeTransaction = createAsyncThunk(
  "transactionApp/removeTransaction",
  async (val, { dispatch, getState }) => {
    const { id } = getState().transactionApp.transaction;
    await axios.delete(`/api/transaction/${id}`);
    return id;
  }
);

export const saveTransaction = createAsyncThunk(
  "studenrApp/saveTransaction",
  async (transactionData, { dispatch, getState }) => {
    const { id } = getState().transactionApp.transaction;
    const response = await axios.put(
      `/api/transaction/${id}`,
      transactionData
      );
    const data = await response.data;
    return data;
  }
);

export const createTransaction = createAsyncThunk(
  "transactionApp/createTransaction",
  async (transactionData, { dispatch, getState }) => {
    const { id } = getState().transactionApp.transaction;
    const response = await axios.post(
      `/api/transaction/${id}`,
      transactionData
    );

    const data = await response.data;
    return data;
  }
);

const transactionSlice = createSlice({
  name: "transactionApp",
  initialState: null,
  reducers: {
    resetTransaction: () => null,
    newTransaction: {
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
    [getTransactionById.fulfilled]: (state, action) => action.payload,
    [saveTransaction.fulfilled]: (state, action) => action.payload,
    [createTransaction.fulfilled]: (state, action) => action.payload,
    [removeTransaction.fulfilled]: (state, action) => null,
  },
});

export const { newTransaction, resetTransaction } = transactionSlice.actions;

export const selectTransaction = ({ transactionApp }) => transactionApp;

export default transactionSlice.reducer;
