import {Account, Server} from 'stellar-sdk';
import {MismatchedAddressError} from '../errors';

export class Session {
  constructor({username, address, account, secret, data, permanent}) {
    this._username  = username;
    this._address   = address;
    this._account   = account;
    this._secret    = secret;
    this._data      = data;
    this._permanent = permanent;
  }

  get username() {
    return this._username;
  }

  get address() {
    return this._address;
  }

  get account() {
    return this._account;
  }

  get secret() {
    return this._secret;
  }

  get data() {
    return this._data;
  }

  getAccount() {
    return this._account;
  }

  setAccount(account) {
    this._account = account;
  }

  getUsername() {
    return this._username;
  }

  getAddress() {
    return this._address;
  }

  getSecret() {
    return this._secret;
  }

  isPermanent() {
    return !!this._permanent;
  }

  getData() {
    return this._data;
  }

  destroy() {
    this._username = null;
    this._account = null;
    this._address = null;
    this._secret = null;
    this._data = null;
  }
}
