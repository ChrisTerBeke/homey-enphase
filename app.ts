const { OAuth2App } = require('homey-oauth2app')
import { EnphaseOAuth2Client } from './lib/EnphaseOAuth2Client'

class EnphaseApp extends OAuth2App {

  static OAUTH2_CLIENT = EnphaseOAuth2Client
  static OAUTH2_DEBUG = true
  static OAUTH2_MULTI_SESSION = true
}

module.exports = EnphaseApp
