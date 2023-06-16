import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()

// @ts-ignore 80005 homey-oauth2app does not have type declarations
const { OAuth2App } = require('homey-oauth2app')
import { EnphaseOAuth2Client } from './lib/EnphaseOAuth2Client'

class EnphaseApp extends OAuth2App {

  static OAUTH2_CLIENT = EnphaseOAuth2Client
  static OAUTH2_MULTI_SESSION = true
}

module.exports = EnphaseApp
