import Homey from 'homey'
const { OAuth2Client, OAuth2Token, OAuth2Error, fetch } = require('homey-oauth2app')

export type SystemsResponse = {
    systems: System[]
}

export type System = {
    system_id: number
    name: string
    public_name: string
    timezone: string
    connection_type: string
    status: string
}

export type SystemSummaryResponse = {
    system_id: number
    current_power: number
    energy_lifetime: number
    energy_today: number
    modules: number
    size_w: number
    last_report_at: number
}

export class EnphaseOAuth2Client extends OAuth2Client {

    static API_URL = 'https://api.enphaseenergy.com/api/v4'
    static AUTHORIZATION_URL = 'https://api.enphaseenergy.com/oauth/authorize'
    static TOKEN_URL = 'https://api.enphaseenergy.com/oauth/token'
    static SCOPES = ['read', 'write']

    async onGetTokenByCode({ code }: { code: string }): Promise<void> {
        const basicAuth = Buffer.from(`${Homey.env.CLIENT_ID}:${Homey.env.CLIENT_SECRET}`).toString('base64')
        const body = new URLSearchParams()
        body.append('grant_type', 'authorization_code')
        body.append('code', code)
        body.append('redirect_uri', this._redirectUrl)
        const response = await fetch(this._tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`
            },
            body: body,
        })
        if (!response.ok) return this.onHandleGetTokenByCodeError({ response })
        this._token = await this.onHandleGetTokenByCodeResponse({ response })
        return this.getToken()
    }

    async getSystems(): Promise<SystemsResponse> {
        return await this.get({
            path: `/systems?key=${Homey.env.API_KEY}`,
        })
    }

    async getSystem(systemId: string): Promise<System> {
        return await this.get({
            path: `/systems/${systemId}?key=${Homey.env.API_KEY}`,
        })
    }

    async getSystemSummary(systemId: string): Promise<SystemSummaryResponse> {
        return await this.get({
            path: `/systems/${systemId}/summary?key=${Homey.env.API_KEY}`,
        })
    }
}
