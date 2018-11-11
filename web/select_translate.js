import {
  config
} from '../config';
import axios from '../node_modules/axios/dist/axios.min.js'
class SelectTranslate {

  constructor() {

  }

  async select() {
    let selectString = window.getSelection().toString();
    if (selectString !== '' && selectString.length<= 15) {
      alert(selectString);
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
