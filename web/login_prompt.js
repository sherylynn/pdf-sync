/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  NullL10n
} from './ui_utils';
import {
  PasswordResponses
} from 'pdfjs-lib';
import {
  config
} from '../config';
import md5 from '../node_modules/blueimp-md5/js/md5.js'
//import md5 from '../node_modules/js-md5/src/md5.js';
import PouchDB from './../node_modules/pouchdb/dist/pouchdb.js';
import PouchdbAuthentication from '../node_modules/pouchdb-authentication/dist/pouchdb.authentication.js';
PouchDB.plugin(PouchdbAuthentication);

// import PouchDB from 'pouch// console.log(databaseStr);
let url = new URL(window.location.href);
// electron or gulp server
// '/db' for gulp proxy
// let origin = url.protocol == 'file:' ? config.server_origin : url.origin + '/db';
let origin = config.server_origin;
let db = new PouchDB(origin + '/pdf-sync');
db.logIn(config.server_admin, config.server_passwd, function (err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log('haved login.');
  }
});

/**
 * @typedef {Object} PasswordPromptOptions
 * @property {string} overlayName - Name of the overlay for the overlay manager.
 * @property {HTMLDivElement} container - Div container for the overlay.
 * @property {HTMLParagraphElement} label - Label containing instructions for
 *                                          entering the password.
 * @property {HTMLInputElement} input - Input field for entering the password.
 * @property {HTMLButtonElement} submitButton - Button for submitting the
 *                                              password.
 * @property {HTMLButtonElement} cancelButton - Button for cancelling password
 *                                              entry.
 */

class LoginPrompt {
  /**
   * @param {PasswordPromptOptions} options
   * @param {OverlayManager} overlayManager - Manager for the viewer overlays.
   * @param {IL10n} l10n - Localization service.
   */
  constructor(options, overlayManager, l10n = NullL10n) {
    this.overlayName = options.overlayName;
    this.container = options.container;
    this.username_label = options.username_label;
    this.passwd_label = options.passwd_label;
    this.username_input = options.username_input;
    this.passwd_input = options.passwd_input;
    this.submitButton = options.submitButton;
    this.cancelButton = options.cancelButton;
    this.resetButton = options.resetButton;
    this.overlayManager = overlayManager;
    this.l10n = l10n;

    this.updateCallback = null;
    this.reason = null;

    // Attach the event listeners.
    this.submitButton.addEventListener('click', this.verify.bind(this));
    this.cancelButton.addEventListener('click', this.close.bind(this));
    this.resetButton.addEventListener('click', this.reset.bind(this));
    this.passwd_input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) { // Enter key
        this.verify();
      }
    });

    this.overlayManager.register(this.overlayName, this.container,
      this.close.bind(this), true);
  }

  async autoOpen() {
    let username = localStorage.getItem(
      'pdf-sync.username') ? localStorage.getItem(
      'pdf-sync.username') : 'guest';
    let passwd = localStorage.getItem('pdf-sync.passwd') ? localStorage.getItem(
      'pdf-sync.passwd') : md5('******');
    if (await this._checkAndReg(username, passwd)) {
      console.log('loged');
      if (username === 'guest') {
        // add sync to local
        this._syncToLocal();
        this.open();
      }

    } else {
      this.open();
    }
  }

  open() {
    let username = localStorage.getItem(
      'pdf-sync.username') ? localStorage.getItem(
      'pdf-sync.username') : 'guest';
    this.overlayManager.open(this.overlayName).then(() => {
      this.username_input.focus();

      let promptString;
      if (this.reason === PasswordResponses.INCORRECT_PASSWORD) {
        promptString = this.l10n.get('password_invalid', null,
          'Invalid password. Please try again.');
      } else {
        promptString = this.l10n.get('password_passwd', null,
          'Enter the password:');
      }

      promptString.then((msg) => {
        this.passwd_label.textContent = msg;
        this.username_input.value = username;
        if (username === 'guest') {
          this.passwd_input.value = '******';
        }
        //
      });
    });
  }

  reset() {
    this.username_input.value = '';
    this.passwd_input.value = '';
    localStorage.removeItem('pdf-sync.username');
    localStorage.removeItem('pdf-sync.passwd');
    localStorage.removeItem('pdf-sync.logState');
    // this.username_label.textContent = 'username had reseted';
    // this.passwd_label.textContent = 'password had reseted';

    // localStorage.setItem('pdf-sync.username', null);
    // localStorage.setItem('pdf-sync.passwd', null);
    // localStorage.setItem('pdf-sync.logState', null);
  }

  close() {
    this.overlayManager.close(this.overlayName).then(() => {
      this.username_input.value = '';
      this.passwd_input.value = '';
    });
  }

  async _syncToLocal() {
    let username = localStorage.getItem(
      'pdf-sync.username') ? localStorage.getItem(
      'pdf-sync.username') : 'guest';
    let passwd = localStorage.getItem('pdf-sync.passwd') ? localStorage.getItem(
      'pdf-sync.passwd') : md5('******');
    try {
      let doc = await db.get(username);
      localStorage.setItem('pdfjs.history', doc['databaseStr']);
    } catch (err) {
      console.log(err);
    }
  }

  async _checkAndReg(username, passwd) {
    try {
      let doc = await db.get(username);
      if (doc.passwd !== passwd) {
        console.log('error passwd');
        return false;
      } else if (doc.passwd === passwd) {
        localStorage.setItem('pdf-sync.username', username);
        localStorage.setItem('pdf-sync.passwd', passwd);
        localStorage.setItem('pdf-sync.logState', 'logged');
        return true;
      }
    } catch (err) {
      console.log(err);
      try {
        let res = await db.put({
          _id: username,
          username,
          passwd,
        });
        localStorage.setItem('pdf-sync.username', username);
        localStorage.setItem('pdf-sync.passwd', passwd);
        localStorage.setItem('pdf-sync.logState', 'logged');
        console.log(res);
        return true;
      } catch (err) {
        console.log(err);
        console.log('maybe not internet');
        return false;
      }
    }
  }

  async verify() {
    let username = this.username_input.value;
    let password = this.passwd_input.value;

    if (password && password.length > 0) {
      if (await this._checkAndReg(username, md5(password))) {
        // add sync to local
        await this._syncToLocal();
        this.close();
      } else {
        this.reset();
      }
      // return this.updateCallback(password);
    }
  }

  setUpdateCallback(updateCallback, reason) {
    this.updateCallback = updateCallback;
    this.reason = reason;
  }
}

export {
  LoginPrompt,
};
