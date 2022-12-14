const { OAuth2Device } = require('homey-oauth2app')

const POLL_INTERVAL_MS = 1000 * 60 * 5

class EnphaseEnvoyDevice extends OAuth2Device {

	private _syncInterval?: NodeJS.Timer

	async onOAuth2Init(): Promise<void> {
		const { systemId } = this.getData()
		this._syncInterval = setInterval(this._updateSolarProduction.bind(this, systemId), POLL_INTERVAL_MS)
		await this._updateSolarProduction(systemId)
	}

	private async _updateSolarProduction(systemId: string): Promise<void> {
		const systemSummary = await this.oAuth2Client.getSystemSummary(systemId)
		this.setCapabilityValue('measure_power', systemSummary.current_power)
		this.setCapabilityValue('meter_power', systemSummary.energy_lifetime / 1000)
		this.setCapabilityValue('meter_power_today', systemSummary.energy_today / 1000)
		this.setCapabilityValue('modules', systemSummary.modules)
		this.setCapabilityValue('alarm_status', systemSummary.status !== 'normal')
	}

	async onOAuth2Deleted(): Promise<void> {
		clearInterval(this._syncInterval)
		this._syncInterval = undefined
	}
}

module.exports = EnphaseEnvoyDevice
