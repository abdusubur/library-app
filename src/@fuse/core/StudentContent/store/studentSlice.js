import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import FuseUtils from "@fuse/utils";

export const getStudentById = createAsyncThunk(
  "studentApp/getStudent",
  async (studentId) => {
    console.log("Hello")
    const response = await axios.get(`/api/student/${studentId}`);
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const removeStudent = createAsyncThunk(
  "studentApp/removeStudent",
  async (val, { dispatch, getState }) => {
    const { id } = getState().studentApp.student;
    await axios.delete(`/api/student/${id}`);
    return id;
  }
);

export const saveStudent = createAsyncThunk(
  "studenrApp/saveStudent",
  async (studentData, { dispatch, getState }) => {
    const { id } = getState().studentApp.student;
    const response = await axios.put(
      `/api/student/${id}`,
      studentData
      );
    const data = await response.data;
    return data;
  }
);

export const createStudent = createAsyncThunk(
  "studentApp/createStudent",
  async (studentData, { dispatch, getState }) => {
    const { id } = getState().studentApp.student;
    const response = await axios.post(
      `/api/student/${id}`,
      studentData
    );

    const data = await response.data;
    return data;
  }
);

const studentSlice = createSlice({
  name: "studentApp",
  initialState: null,
  reducers: {
    resetStudent: () => null,
    newStudent: {
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
    [getStudentById.fulfilled]: (state, action) => action.payload,
    [saveStudent.fulfilled]: (state, action) => action.payload,
    [createStudent.fulfilled]: (state, action) => action.payload,
    [removeStudent.fulfilled]: (state, action) => null,
  },
});

export const { newStudent, resetStudent } = studentSlice.actions;

export const selectStudent = ({ studentApp }) => studentApp;

export default studentSlice.reducer;
