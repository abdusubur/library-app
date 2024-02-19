import FuseUtils from "@fuse/utils/FuseUtils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

class BooksService extends FuseUtils.EventEmitter {
  init() {}

  getBooks = (gidenObje) => {
    return new Promise((resolve) => {
      axios.post("/api/books", gidenObje).then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };

  getWriter = () => {
    return new Promise((resolve) => {
      axios.post("/api/books/writers").then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };

  getPublisher = () => {
    return new Promise((resolve) => {
      axios.post("/api/books/publisher").then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };

  getBookName = () => {
    return new Promise((resolve) => {
      axios.post("/api/books/bookName").then((res) => {
        const data = res;
        resolve(data);
      });
    });
  };


  postBooks = (data) => {
    return new Promise((resolve) => {
      axios.post("/api/books/addBooks", data).then((res) => {
        console.log("Data :",data);
        resolve(res.data);
      });
    });
  };
}



// export const getBooks = createAsyncThunk(
//   "books/details/getBooks",
//   async (booksId) => {
//     const response = await axios.get(`/api/books/details/${booksId}`);
//     const data = await response.data;
//     console.log("Response :", response)

//     return data === undefined ? null : data;
//   }
// );



const instance = new BooksService();
export default instance;
