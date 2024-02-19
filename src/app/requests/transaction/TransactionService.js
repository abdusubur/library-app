import FuseUtils from "@fuse/utils/FuseUtils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


class TransactionService extends FuseUtils.EventEmitter {
  init() {}

  getStudents = (gidenObje) => {
    return new Promise((resolve) => {
      axios.post("/api/studentTransaction", gidenObje).then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };

  getStudentsByNumber = (studentById) => {
    return new Promise((resolve) => {
      axios.post("/api/studentByNumbers", studentById).then((res) => {
        console.log("Hello" , res.data)
        const data = res;
        resolve(data);
      });
    });
  };

  getBookByName = (bookByName) => {
    return new Promise((resolve) => {
      axios.post("/api/bookByName", bookByName).then((res) => {
        console.log("Hello" , res.data)
        const data = res;
        resolve(data);
      });
    });
  };


  postStudentBook = (data) => {
    return new Promise((resolve) => {
      axios.post("/api/students/addStudentBook", data).then((res) => {
        console.log("Service :", res.data.data)
        resolve(res.data.data);
      });
    });
  };
  
  getDurumu = () => {
    return new Promise((resolve) => {
      axios.post("/api/transaction/durumu").then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };
}


const instance = new TransactionService();
export default instance;
