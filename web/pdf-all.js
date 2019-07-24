import axios from '../node_modules/axios/dist/axios.min.js';
import {
  config
} from '../config';

import { getGlobalEventBus } from './dom_events';

class PdfAll {

  constructor(eventBus) {
    this.lastUploadPageNum = -1;
    this.pdf_all_url = config.pdf_all_url;
    this.pdf_all_username = config.pdf_all_username;

    this.eventBus = eventBus || getGlobalEventBus();
    this.initialized = false;
    this._boundEvents = Object.create(null);
    this._isViewerInPresentationMode = false;
    this._isPagesLoaded = false;

    this.updateProgress = async () => {
      let pageNum = PDFViewerApplication.page - 1;
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
    };

    // Ensure that we don't miss either a 'presentationmodechanged' or a
    // 'pagesloaded' event, by registering the listeners immediately.
    this.eventBus.on('presentationmodechanged', (evt) => {
      this._isViewerInPresentationMode = evt.active || evt.switchInProgress;
    });
    this.eventBus.on('pagesloaded', (evt) => {
      this._isPagesLoaded = !!evt.pagesCount;
      console.log('加载完毕');
      this.getLatestProgress();
      this.Sync();
      // this.timer = window.setInterval(this.updateProgress, 15000);
    });
  }

  async getLatestProgress() {
    let url = this.pdf_all_url + '/get_latest_progress?username=' +
      this.pdf_all_username + '&identifier=' + this.identifier();
    console.log('进度获取地址' + url);
    try {
      let response = await axios.get(url);
      console.log('进度');
      console.log(response.data);
      PDFViewerApplication.page = response.data.page_num + 1;
    } catch (error) {
      console.error(error);
      return { page_num: 1, };
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



  Sync() {
    let timer = window.setInterval(this.updateProgress, 9000);
  }

}

export {
  PdfAll,
};
