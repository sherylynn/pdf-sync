import axios from '../node_modules/axios/dist/axios.min.js';
import {
  config
} from '../config';

class PdfAll {

  constructor() {
    this.lastUploadPageNum = -1;
    this.pdf_all_url = config.pdf_all_url;
    this.pdf_all_username = config.pdf_all_username;
  }

  async getLatestProgress() {
    let url = this.pdf_all_url + '/get_latest_progress?username=' +
      this.pdf_all_username + '&identifier=' + this.identifier();
    console.log('进度获取地址' + url);
    try {
      let response = await axios.get(url);
      console.log('进度');
      console.log(response.data);
      PDFViewerApplication.page = response.data.page_num;
    } catch (error) {
      console.error(error);
      return { page_num: 0, };
    }
  }

  left_zero_4(str) {
    if (str !== null && str !== '' && str !== 'undefined') {
        if (str.length === 2) {
            return '' + str;
        }
    }
    return str;
}

  unicode(str) {
    let value = '';
    for (let i = 0; i < str.length; i++) {
        value += '\\u' + this.left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
    }
    return value;
  }

  identifier() {
    return this.unicode(document.title);
  }

  async updateProgress() {
    let pageNum = PDFViewerApplication.page;
    if (pageNum === this.lastUploadPageNum) {
        return;
    }
    let url = this.pdf_all_url + '/update_progress?username=' + this.pdf_all_username + '&identifier=' + this.identifier() + '&page_num=' + pageNum;
    console.log('进度推送地址' + url);
    try {
      let response = await axios.get(url);
      console.log(response.data);
      this.lastUploadPageNum = pageNum;
    } catch (error) {
      console.error(error);
    }
  }

  Sync() {
    let timer = window.setInterval(this.updateProgress, 15000);
  }

}

export {
  PdfAll,
};
