// module/validate.js
var Validate = class {
  static username(username) {
    if (typeof username == "undefined" || username == null)
      return false;
    return /^[a-z0-9._]{6,30}$/i.test(username);
  }
  static password(password) {
    if (typeof password == "undefined" || password == null)
      return false;
    return password.length >= 8;
  }
  static url(url) {
    if (typeof url == "undefined" || url == null)
      return false;
    return !/\s/.test(url);
  }
  static email(email) {
    if (typeof email == "undefined" || email == null)
      return false;
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(email);
  }
  static otp(otp) {
    if (typeof otp == "undefined" || otp == null)
      return false;
    return otp.length == 0 || otp.length == 6 || otp.length == 44;
  }
  static token(token) {
    if (typeof token == "undefined" || token == null)
      return false;
    return /^[a-z0-9]{64}$/i.test(token);
  }
  static pWebsite(website) {
    if (typeof website == "undefined" || website == null)
      return false;
    return website.length >= 2 && website.length <= 100;
  }
  static pUsername(username) {
    if (typeof username == "undefined" || username == null)
      return false;
    return username.length >= 2 && username.length <= 100;
  }
  static pPassword(password) {
    if (typeof password == "undefined" || password == null)
      return false;
    return password.length >= 2 && password.length <= 100;
  }
  static pMessage(message) {
    if (typeof message == "undefined" || message == null)
      return false;
    return message.length >= 0 && message.length <= 5e3;
  }
  static positiveInteger(number) {
    if (typeof number == "undefined" || number == null)
      return false;
    return number >>> 0 === parseFloat(number);
  }
  static yubiKey(id) {
    if (typeof id == "undefined" || id == null)
      return false;
    return id.length == 44;
  }
  static license(license) {
    if (typeof license == "undefined" || license == null)
      return false;
    return license.length == 29;
  }
  static json(json) {
    try {
      JSON.parse(json);
      return true;
    } catch {
    }
    return false;
  }
};

// node_modules/@rabbit-company/xchacha20/src/xchacha20.js
var XChaCha20 = class {
  constructor() {
    this.keystream = NaN;
    this.encryptedText = NaN;
    this.plaintext = NaN;
    this.nonce = NaN;
  }
  rotateleft = (a, b) => {
    return a << b | a >>> 32 - b;
  };
  le32 = (a, b, c, d) => {
    return (a ^ b << 8 ^ c << 16 ^ d << 24) >>> 0;
  };
  int2(data) {
    var hex, i;
    let result = [];
    for (i = 0; i < data.length; i++) {
      hex = data.charCodeAt(i).toString(16);
      result.push(parseInt(hex, 16));
    }
    return result;
  }
  Qround(state, a, b, c, d) {
    state[a] += state[b];
    state[d] ^= state[a];
    state[d] = this.rotateleft(state[d], 16);
    state[c] += state[d];
    state[b] ^= state[c];
    state[b] = this.rotateleft(state[b], 12);
    state[a] += state[b];
    state[d] ^= state[a];
    state[d] = this.rotateleft(state[d], 8);
    state[c] += state[d];
    state[b] ^= state[c];
    state[b] = this.rotateleft(state[b], 7);
    state[a] >>>= 0;
    state[b] >>>= 0;
    state[c] >>>= 0;
    state[d] >>>= 0;
  }
  Inner_Block(state) {
    this.Qround(state, 0, 4, 8, 12);
    this.Qround(state, 1, 5, 9, 13);
    this.Qround(state, 2, 6, 10, 14);
    this.Qround(state, 3, 7, 11, 15);
    this.Qround(state, 0, 5, 10, 15);
    this.Qround(state, 1, 6, 11, 12);
    this.Qround(state, 2, 7, 8, 13);
    this.Qround(state, 3, 4, 9, 14);
  }
  Chacha20_BlockFunction(key, nonce, block_counter) {
    let state = [];
    state[0] = 1634760805;
    state[1] = 857760878;
    state[2] = 2036477234;
    state[3] = 1797285236;
    state[4] = this.le32(key[0], key[1], key[2], key[3]);
    state[5] = this.le32(key[4], key[5], key[6], key[7]);
    state[6] = this.le32(key[8], [9], key[10], key[11]);
    state[7] = this.le32(key[12], key[13], key[14], key[15]);
    state[8] = this.le32(key[16], key[17], [18], key[19]);
    state[9] = this.le32(key[20], key[21], [22], key[23]);
    state[10] = this.le32(key[24], key[25], key[26], key[27]);
    state[11] = this.le32(key[28], key[29], key[30], key[31]);
    state[12] = block_counter;
    state[13] = this.le32(nonce[0], nonce[1], nonce[2], nonce[3]);
    state[14] = this.le32(nonce[4], nonce[5], nonce[6], nonce[7]);
    state[15] = this.le32(nonce[8], nonce[9], nonce[10], nonce[11]);
    let temp = new Uint32Array(state.slice());
    for (let i = 1; i <= 10; i++) {
      this.Inner_Block(temp);
    }
    let Serialized_Block = [];
    for (let i = 0, i2 = 0; i < 16; i++) {
      state[i] += temp[i];
      Serialized_Block[i2++] = state[i] & 255;
      Serialized_Block[i2++] = state[i] >>> 8 & 255;
      Serialized_Block[i2++] = state[i] >>> 16 & 255;
      Serialized_Block[i2++] = state[i] >>> 24 & 255;
    }
    return Serialized_Block;
  }
  HChacha20_BlockFunction(key, nonce) {
    let state = [];
    state[0] = 1634760805;
    state[1] = 857760878;
    state[2] = 2036477234;
    state[3] = 1797285236;
    state[4] = this.le32(key[0], key[1], key[2], key[3]);
    state[5] = this.le32(key[4], key[5], key[6], key[7]);
    state[6] = this.le32(key[8], [9], key[10], key[11]);
    state[7] = this.le32(key[12], key[13], key[14], key[15]);
    state[8] = this.le32(key[16], key[17], [18], key[19]);
    state[9] = this.le32(key[20], key[21], [22], key[23]);
    state[10] = this.le32(key[24], key[25], key[26], key[27]);
    state[11] = this.le32(key[28], key[29], key[30], key[31]);
    state[12] = this.le32(nonce[0], nonce[1], nonce[2], nonce[3]);
    state[13] = this.le32(nonce[4], nonce[5], nonce[6], nonce[7]);
    state[14] = this.le32(nonce[8], nonce[9], nonce[10], nonce[11]);
    state[15] = this.le32(nonce[12], nonce[13], nonce[14], nonce[15]);
    let temp = new Uint32Array(state.slice());
    for (let i = 1; i <= 10; i++) {
      this.Inner_Block(temp);
    }
    let B1 = temp.slice(0, 4);
    let B2 = temp.slice(12, 16);
    let B = new Uint32Array(B1.length + B2.length);
    B.set(B1);
    B.set(B2, B1.length);
    let Serialized_Block = [];
    for (let i = 0, i2 = 0; i < 8; i++) {
      Serialized_Block[i2++] = B[i] & 255;
      Serialized_Block[i2++] = B[i] >>> 8 & 255;
      Serialized_Block[i2++] = B[i] >>> 16 & 255;
      Serialized_Block[i2++] = B[i] >>> 24 & 255;
    }
    return Serialized_Block;
  }
  chacha20_encrypt(key, counter, nonce, plaintext) {
    let keystream = [];
    keystream.push(...this.Chacha20_BlockFunction(key, nonce, counter));
    let pos = 0;
    for (let i = 0; i < plaintext.length; i++) {
      if (pos == 64) {
        counter++;
        keystream.push(...this.Chacha20_BlockFunction(key, nonce, counter));
        pos = 0;
      }
      plaintext[i] = parseInt(plaintext[i], 16);
      pos++;
    }
    let cipherText = [];
    for (let i = 0; i <= plaintext.length; i++) {
      cipherText[i] = plaintext[i] ^ keystream[i];
    }
    this.keystream = keystream;
    this.encryptedText = cipherText;
  }
  chacha20_decrypt(key, counter, nonce, eT) {
    let keystream = [];
    keystream.push(...this.Chacha20_BlockFunction(key, nonce, counter));
    let pos = 0;
    for (let i = 0; i < eT.length; i++) {
      if (pos == 64) {
        counter++;
        keystream.push(...this.Chacha20_BlockFunction(key, nonce, counter));
        pos = 0;
      }
      pos++;
    }
    let pT = [];
    for (let i = 0; i < this.encryptedText.length; i++) {
      pT[i] = this.encryptedText[i] ^ keystream[i];
    }
    this.plaintext = pT;
  }
  xchacha20_decrypt(key, encryptedText) {
    this.encryptedText = this.int2(XChaCha20.b64DecodeUnicode(encryptedText));
    let nonce = this.encryptedText.slice(-24);
    this.encryptedText = this.encryptedText.slice(0, -24);
    let subkey = this.HChacha20_BlockFunction(key, nonce.slice(0, 16));
    let chacha20_nonce = [0, 0, 0, 0];
    chacha20_nonce.push(...nonce.slice(16, 24));
    this.chacha20_decrypt(subkey, 0, chacha20_nonce, this.encryptedText);
  }
  xchacha20_encrypt(key, nonce, plaintext) {
    let subkey = this.HChacha20_BlockFunction(key, nonce.slice(0, 16));
    let chacha20_nonce = [0, 0, 0, 0];
    chacha20_nonce.push(...nonce.slice(16, 24));
    this.chacha20_encrypt(subkey, 0, chacha20_nonce, plaintext);
  }
  static convertToText(data) {
    let text = "";
    for (let i = 0; i < data.length; i++) {
      text += String.fromCharCode(data[i]);
    }
    return text;
  }
  static hexEncode(data) {
    var hex, i;
    let result = [];
    for (i = 0; i < data.length; i++) {
      hex = data.charCodeAt(i).toString(16);
      result.push(hex);
    }
    return result;
  }
  static b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode("0x" + p1);
      }
    ));
  }
  static b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split("").map(function(c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  }
  static randomNonce() {
    var rand_n = new Uint8Array(24);
    crypto.getRandomValues(rand_n);
    return rand_n;
  }
  static encrypt(message, secretKey) {
    message = XChaCha20.hexEncode(message);
    secretKey = XChaCha20.hexEncode(secretKey);
    let nonce = XChaCha20.randomNonce();
    let e1 = new XChaCha20();
    e1.xchacha20_encrypt(secretKey, nonce, message);
    e1.encryptedText.push(...nonce);
    e1.encryptedText = XChaCha20.b64EncodeUnicode(XChaCha20.convertToText(e1.encryptedText));
    return e1.encryptedText;
  }
  static decrypt(message, secretKey) {
    secretKey = XChaCha20.hexEncode(secretKey);
    let d1 = new XChaCha20();
    d1.xchacha20_decrypt(secretKey, message);
    return XChaCha20.convertToText(d1.plaintext).replace("\0", "");
  }
};

// module/passky.js
var Passky = class {
  static getInfo(server) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      fetch(server + "?action=getInfo").then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static getStats(server) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      fetch(server + "?action=getStats").then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static getReport(server) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      fetch(server + "?action=getReport").then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static createAccount(server, username, password, email) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.email(email))
        return reject(1007);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.password(password))
        return reject(1006);
      let data = new FormData();
      data.append("email", email);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + password));
      fetch(server + "?action=createAccount", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          console.log(error);
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static getToken(server, username, password, otp = "", encrypted = true) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.password(password))
        return reject(1006);
      if (!Validate.otp(otp))
        return reject(1002);
      let data = new FormData();
      data.append("otp", otp);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + password));
      fetch(server + "?action=getToken", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          let data2 = JSON.parse(response);
          if (!encrypted && data2.passwords != null) {
            for (let i = 0; i < data2.passwords.length; i++) {
              data2.passwords[i].website = XChaCha20.decrypt(data2.passwords[i].website, password);
              data2.passwords[i].username = XChaCha20.decrypt(data2.passwords[i].username, password);
              data2.passwords[i].password = XChaCha20.decrypt(data2.passwords[i].password, password);
              data2.passwords[i].message = XChaCha20.decrypt(data2.passwords[i].message, password);
            }
          }
          return resolve(data2);
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static getPasswords(server, username, token, password = "", encrypted = true) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!encrypted && !Validate.password(password))
        return reject(1006);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=getPasswords", {
        method: "POST",
        headers
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          let data = JSON.parse(response);
          if (!encrypted && data.passwords != null) {
            for (let i = 0; i < data.passwords.length; i++) {
              data.passwords[i].website = XChaCha20.decrypt(data.passwords[i].website, password);
              data.passwords[i].username = XChaCha20.decrypt(data.passwords[i].username, password);
              data.passwords[i].password = XChaCha20.decrypt(data.passwords[i].password, password);
              data.passwords[i].message = XChaCha20.decrypt(data.passwords[i].message, password);
            }
          }
          return resolve(data);
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static savePassword(server, username, token, password, [pWebsite, pUsername, pPassword, pMessage]) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!Validate.password(password))
        return reject(1006);
      if (!Validate.pWebsite(pWebsite))
        return reject(1008);
      if (!Validate.pUsername(pUsername))
        return reject(1009);
      if (!Validate.pPassword(pPassword))
        return reject(1010);
      if (!Validate.pMessage(pMessage))
        return reject(1011);
      pWebsite = XChaCha20.encrypt(pWebsite, password);
      pUsername = XChaCha20.encrypt(pUsername, password);
      pPassword = XChaCha20.encrypt(pPassword, password);
      pMessage = XChaCha20.encrypt(pMessage, password);
      if (pWebsite.length > 255)
        return reject(1008);
      if (pUsername.length > 255)
        return reject(1009);
      if (pPassword.length > 255)
        return reject(1010);
      if (pMessage.length > 1e4)
        return reject(1011);
      let data = new FormData();
      data.append("website", pWebsite);
      data.append("username", pUsername);
      data.append("password", pPassword);
      data.append("message", pMessage);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=savePassword", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static editPassword(server, username, token, password, passwordID, [pWebsite, pUsername, pPassword, pMessage]) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!Validate.password(password))
        return reject(1006);
      if (!Validate.positiveInteger(passwordID))
        return reject(1012);
      if (!Validate.pWebsite(pWebsite))
        return reject(1008);
      if (!Validate.pUsername(pUsername))
        return reject(1009);
      if (!Validate.pPassword(pPassword))
        return reject(1010);
      if (!Validate.pMessage(pMessage))
        return reject(1011);
      pWebsite = XChaCha20.encrypt(pWebsite, password);
      pUsername = XChaCha20.encrypt(pUsername, password);
      pPassword = XChaCha20.encrypt(pPassword, password);
      pMessage = XChaCha20.encrypt(pMessage, password);
      if (pWebsite.length > 255)
        return reject(1008);
      if (pUsername.length > 255)
        return reject(1009);
      if (pPassword.length > 255)
        return reject(1010);
      if (pMessage.length > 1e4)
        return reject(1011);
      let data = new FormData();
      data.append("password_id", passwordID);
      data.append("website", pWebsite);
      data.append("username", pUsername);
      data.append("password", pPassword);
      data.append("message", pMessage);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=editPassword", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static deletePassword(server, username, token, passwordID) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!Validate.positiveInteger(passwordID))
        return reject(1012);
      let data = new FormData();
      data.append("password_id", passwordID);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=deletePassword", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static deletePasswords(server, username, token) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=deletePasswords", {
        method: "POST",
        headers
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static deleteAccount(server, username, token) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=deleteAccount", {
        method: "POST",
        headers
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static enable2FA(server, username, token) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=enable2fa", {
        method: "POST",
        headers
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static disable2FA(server, username, token) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      fetch(server + "?action=disable2fa", {
        method: "POST",
        headers
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static addYubiKey(server, username, token, id) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!Validate.yubiKey(id))
        return reject(1004);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      let data = new FormData();
      data.append("id", id);
      fetch(server + "?action=addYubiKey", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static removeYubiKey(server, username, token, id) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!Validate.yubiKey(id))
        return reject(1004);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      let data = new FormData();
      data.append("id", id);
      fetch(server + "?action=removeYubiKey", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static forgotUsername(server, email) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.email(email))
        return reject(1007);
      let data = new FormData();
      data.append("email", email);
      fetch(server + "?action=forgotUsername", {
        method: "POST",
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static upgradeAccount(server, username, token, license) {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!Validate.license(license))
        return reject(1014);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      let data = new FormData();
      data.append("license", license);
      fetch(server + "?action=upgradeAccount", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
  static importPasswords(server, username, token, passwords, encrypted = false, password = "") {
    return new Promise((resolve, reject) => {
      if (!Validate.url(server))
        return reject(1001);
      if (!Validate.username(username))
        return reject(1005);
      if (!Validate.token(token))
        return reject(1003);
      if (!encrypted) {
        if (!Validate.password(password))
          return reject(1006);
        for (let i = 0; i < Object.keys(passwords).length; i++) {
          passwords[i].website = XChaCha20.encrypt(passwords[i].website, password);
          passwords[i].username = XChaCha20.encrypt(passwords[i].username, password);
          passwords[i].password = XChaCha20.encrypt(passwords[i].password, password);
          if (!Validate.pMessage(passwords[i].message))
            passwords[i].message = "";
          passwords[i].message = XChaCha20.encrypt(passwords[i].message, password);
        }
      }
      let importPasswords = [];
      for (let i = 0, j = 0; i < Object.keys(passwords).length; i++) {
        if (!(passwords[i].website.length >= 35 && passwords[i].website.length <= 255) || passwords[i].website.indexOf(" ") !== -1)
          continue;
        if (!(passwords[i].username.length >= 35 && passwords[i].username.length <= 255) || passwords[i].username.indexOf(" ") !== -1)
          continue;
        if (!(passwords[i].password.length >= 35 && passwords[i].password.length <= 255) || passwords[i].password.indexOf(" ") !== -1)
          continue;
        if (!(passwords[i].message.length >= 35 && passwords[i].message.length <= 1e4) || passwords[i].password.indexOf(" ") !== -1)
          continue;
        importPasswords[j] = {};
        importPasswords[j]["website"] = passwords[i].website;
        importPasswords[j]["username"] = passwords[i].username;
        importPasswords[j]["password"] = passwords[i].password;
        importPasswords[j]["message"] = passwords[i].message;
        j++;
      }
      if (importPasswords.length == 0)
        return reject(1013);
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(username + ":" + token));
      headers.append("Content-Type", "application/json");
      let data = JSON.stringify(importPasswords);
      fetch(server + "?action=importPasswords", {
        method: "POST",
        headers,
        body: data
      }).then((result) => {
        if (result.status != 200 && result.status != 429)
          return reject(1e3);
        return result.text();
      }).then((response) => {
        try {
          return resolve(JSON.parse(response));
        } catch (error) {
          return reject(1e3);
        }
      }).catch(() => {
        return reject(1e3);
      });
    });
  }
};
export {
  Passky as default
};
