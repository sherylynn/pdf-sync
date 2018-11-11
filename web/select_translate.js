import axios from '../node_modules/axios/dist/axios.min.js';
import {
  config
} from '../config';
import md5 from '../node_modules/blueimp-md5/js/md5.js';
// electron or gulp server
// '/trans' for gulp proxy
let url = new URL(window.location.href);
url = url.protocol == 'file:' ? config.translate_url : url.origin + '/trans';
const appid = config.translate_appid;
const key = config.translate_key;
class SelectTranslate {

  constructor() {

  }

  async select() {
    let selectString = window.getSelection().toString();
    if (selectString !== '') {
      if (selectString.length <= 15) {
        let from = 'auto';
        let to = 'zh';
        let salt = (new Date()).getTime();
        let str1 = appid + selectString + salt + key;
        let sign = md5(str1);
        try {
          let response = await axios.get(url, {
            params: {
              appid,
              q: selectString,
              from,
              to,
              salt,
              sign,
            },
          });
          // axios don't support jsonp
          // alert(selectString+response);
          console.log(response.data);
          alert(response.data.trans_result[0].src + ':' + response.data.trans_result[
            0].dst)
        } catch (error) {
          console.error(error);
        }
      } else {
        alert('字数太长,尽量少于15字')
      }
    }
  }

  bind() {
    console.log('binded');
    window.addEventListener('click', (e) => {
      e.preventDefault();
      this.select();
    }, false);
  }

}

export {
  SelectTranslate,
};
