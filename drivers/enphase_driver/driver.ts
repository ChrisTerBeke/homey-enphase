// @ts-ignore 80005 homey-oauth2app does not have type declarations
const { OAuth2Driver } = require('homey-oauth2app')
import { EnphaseOAuth2Client } from '../../lib/EnphaseOAuth2Client'

class EnphaseDriver extends OAuth2Driver {

	async onPairListDevices({ oAuth2Client }: { oAuth2Client: EnphaseOAuth2Client }): Promise<Object[]> {
		const systems = await oAuth2Client.getSystems()
		return systems.systems.map(system => ({
			name: system.name,
			data: {
				systemId: system.system_id,
			}
		}))
	}
}

module.exports = EnphaseDriver
