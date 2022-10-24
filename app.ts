const { OAuth2App } = require('homey-oauth2app')
const { Log } = require('homey-log')
import { EnphaseOAuth2Client } from './lib/EnphaseOAuth2Client'

class EnphaseApp extends OAuth2App {

  static OAUTH2_CLIENT = EnphaseOAuth2Client
  static OAUTH2_MULTI_SESSION = true

  async onOAuth2Init() {
    this.homeyLog = new Log({ homey: this.homey });
  }
}

module.exports = EnphaseApp
