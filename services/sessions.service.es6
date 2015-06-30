import {SessionAlreadyDefinedError} from "../errors";
import {SessionNotFoundError} from "../errors";
import {Service, Inject} from 'interstellar-core';
import {Session} from "../lib/session";
import _ from 'lodash';
import {Account, NotFoundError} from 'js-stellar-lib';
import moment from 'moment';

const DEFAULT = 'default';

@Service('Sessions')
@Inject("$cookieStore", "interstellar-network.Server")
export default class Sessions {
  constructor($cookieStore, Server) {
    this.$cookieStore = $cookieStore;
    this.Server = Server;
    this.sessions = {};
    _.forEach(this.$cookieStore.get('sessions'), (params, name) => this.create(name, _.extend(params, {permanent: true})));
  }

  get default() {
    return this.get(DEFAULT);
  }

  createDefault(params={}) {
    return this.create(DEFAULT, params);
  }

  hasDefault() {
    return this.has(DEFAULT);
  }

  create(name, params={}) {
    if (this.sessions[name]) {
      throw new SessionAlreadyDefinedError(`A session name "${name}" has already been created`);
    }

    this.sessions[name] = new Session(params);
    this._updateSessionCookie();
    return this.loadAccount(name);
  }

  loadDefaultAccount() {
    return this.loadAccount(DEFAULT);
  }

  loadAccount(name) {
    let address = this.sessions[name].getAddress();
    return this.Server.loadAccount(address)
      .then(account => {
        this.sessions[name].setAccount(account);
      })
      .catch(e => {
        if (e.name === 'NotFoundError') {
          this.sessions[name].setAccount(new Account(address));
        } else {
          throw e;
        }
      });
  }

  get(name) {
    let result = this.sessions[name];
    if (!result) { throw new SessionNotFoundError(`No session named "${name}"`); }
    return result;
  }

  has(name) {
    return !!this.sessions[name];
  }

  destroy(name) {
    let session = this.sessions[name];
    if (session) {
      session.destroy();
    }
    delete this.sessions[name];
    this._updateSessionCookie();
  }

  destroyAll() {
    _.forEach(this.sessions, (session, name) => {
      this.destroy(name);
    });
  }

  _updateSessionCookie() {
    let permanentSessions = {};
    _.forEach(this.sessions, (session, name) => {
      if (!session.isPermanent()) {
        return;
      }
      permanentSessions[name] = _.pick(session, ['username', 'address', 'secret', 'data']);
    });
    this.$cookieStore.put('sessions', permanentSessions, {expires: moment().add(1, 'days').toDate()});
  }
}
