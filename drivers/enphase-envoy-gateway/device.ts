const { OAuth2Device } = require('homey-oauth2app')

const POLL_INTERVAL_MS = 1000 * 60 // 60 seconds

class EnphaseEnvoyDevice extends OAuth2Device {

	async onOAuth2Init(): Promise<void> {
		const { systemId } = this.getData()
		this._syncInterval = setInterval(await this._updateSolarProduction.bind(this, systemId), POLL_INTERVAL_MS)
		await this._updateSolarProduction(systemId)
	}

	private async _updateSolarProduction(systemId: string): Promise<void> {
		const systemSummary = await this.oAuth2Client.getSystemSummary(systemId)
		this.setCapabilityValue('meter_power', systemSummary.energy_today / 1000);
		this.setCapabilityValue('measure_power', systemSummary.current_power);
	}

	async onOAuth2Deleted(): Promise<void> {
		// Clean up here
	}
}

module.exports = EnphaseEnvoyDevice
