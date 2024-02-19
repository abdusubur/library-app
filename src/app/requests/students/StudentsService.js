import FuseUtils from "@fuse/utils/FuseUtils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


class StudentService extends FuseUtils.EventEmitter {
  init() {}

  getStudents = (gidenObje) => {
    return new Promise((resolve) => {
      axios.post("/api/students", gidenObje).then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };

  getClasses = () => {
    return new Promise((resolve) => {
      axios.post("/api/students/classes").then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };

  postStudent = (data) => {
    return new Promise((resolve) => {
      axios.post("/api/students/addStudent", data).then((res) => {
        resolve(res.data);
      });
    });
  };
  
}


const instance = new StudentService();
export default instance;
