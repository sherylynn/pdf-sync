import axios from '../node_modules/axios/dist/axios.min.js';
import {
  config
} from '../config';
import md5 from '../node_modules/blueimp-md5/js/md5.js';
// import 查词 from '../local_trans/查词';//import by index.html
// electron or gulp server
// '/trans' for gulp proxy
let url = new URL(window.location.href);
url = url.protocol == 'file:' ? config.translate_url : url.origin + '/trans';
const appid = config.translate_appid;
const key = config.translate_key;

class SelectTranslate {

  constructor() {

  }

  show(message) {
    alert(message.before + ':' + message.after);
  }

  async select() {
    let selectString = window.getSelection().toString();
    if (selectString !== '') {
      if (selectString.length <= 15) {
        let result = {};
        switch (config.translate_mode) {
          case 'hybrid':
            result = this.local_trans(selectString) ? this.local_trans(selectString):await this.baidu_trans(selectString);
            break;
          default:
            result = this.local_trans(selectString);
        }
        console.log(result);
        this.show(result);
      } else {
        alert('字数太长,尽量少于15字');
      }
    }
  }

  local_trans(selectString) {
    //let result=查词.取释义(selectString).释义
    let result=window.local_dict[selectString.trim().toLowerCase()]
    if(!result){
      return false
    }
      return {before:selectString,after:result}


  }

  async baidu_trans(selectString) {
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
      return { before: response.data.trans_result[0].src, after: response.data.trans_result[0].dst ,};
    } catch (error) {
      console.error(error);
      return { before: 'error', after: error ,};
    }
  }

  bind() {
    console.log('binded');
    document.getElementById('viewer').addEventListener('click', (e) => {
      e.preventDefault();
      this.select();
    }, false);
  }

}

export {
  SelectTranslate,
};
