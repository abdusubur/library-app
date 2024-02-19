import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import mailServiceConfig from "./mailServiceConfig";

/* eslint-disable camelcase */

class MailService extends FuseUtils.EventEmitter {
  //   init() {
  //     this.setInterceptors();
  //   }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  mailCheck = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(mailServiceConfig.mailCheck, data).then((response) => {
        console.log("Response :", response.data);
        resolve(response.data);
        // if (response.data.user) {
        //   this.setSession(response.data.access_token);
        //   resolve(response.data.user);
        //   this.emit('onLogin', response.data.user);
        // } else {
        //   reject(response.data.error);
        // }
      });
    });
  };

  cardCheck = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(mailServiceConfig.cardCheck, data).then((response) => {
        console.log("Response :", response.data);
        resolve(response.data);
        // if (response.data.user) {
        //   this.setSession(response.data.access_token);
        //   resolve(response.data.user);
        //   this.emit('onLogin', response.data.user);
        // } else {
        //   reject(response.data.error);
        // }
      });
    });
  };
}

const instance = new MailService();

export default instance;
