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

export type SystemDevicesResponse = {
    system_id: number
    total_devices: number
    devices: {
        micros: Micro[]
        gateways: Gateway[]
        q_relays: Relay[]
    }
}

export type Micro = {
    id: number
    last_report_at: number
    name: string
    serial_number: string
    part_number: string
    sku: string
    model: string
    status: string
    active: boolean
}

export type Gateway = {
    id: number
    last_report_at: number
    name: string
    serial_number: string
    part_number: string
    emu_sw_version: string
    sku: string
    model: string
    status: string
    active: boolean
    cellular_modem: {
        imei: string
        part_num: string
        sku: string
        plan_start_date: number
        plan_end_date: number
    }
}

export type Relay = {
    id: number
    last_report_at: number
    name: string
    serial_number: string
    part_number: string
    sku: string
    model: string
    status: string
    active: boolean
}

export class EnphaseOAuth2Client extends OAuth2Client {

    static API_URL = 'https://api.enphaseenergy.com/api/v4'
    static AUTHORIZATION_URL = 'https://api.enphaseenergy.com/oauth/authorize'
    static TOKEN_URL = 'https://api.enphaseenergy.com/oauth/token'
    static SCOPES = ['read', 'write']

    async onGetTokenByCode({ code }: { code: string }): Promise<typeof OAuth2Token> {
        const basicAuth = Buffer.from(`${Homey.env.CLIENT_ID}:${Homey.env.CLIENT_SECRET}`).toString('base64')
        const body = new URLSearchParams()
        body.append('grant_type', 'authorization_code')
        body.append('code', code)
        body.append('redirect_uri', this._redirectUrl)
        const response = await fetch(this._tokenUrl, {
            method: 'POST',
            headers: { 'Authorization': `Basic ${basicAuth}` },
            body: body,
        })
        if (!response.ok) return this.onHandleGetTokenByCodeError({ response })
        this._token = await this.onHandleGetTokenByCodeResponse({ response })
        return this.getToken()
    }

    async onRefreshToken(): Promise<typeof OAuth2Token> {
        const token = this.getToken();
        if (!token) throw new OAuth2Error('Missing Token')
        if (!token.isRefreshable()) throw new OAuth2Error('Token cannot be refreshed')
        const basicAuth = Buffer.from(`${Homey.env.CLIENT_ID}:${Homey.env.CLIENT_SECRET}`).toString('base64')
        const body = new URLSearchParams()
        body.append('grant_type', 'refresh_token')
        body.append('refresh_token', token.refresh_token)
        const response = await fetch(this._tokenUrl, {
            method: 'POST',
            headers: { 'Authorization': `Basic ${basicAuth}` },
            body: body,
        })
        if (!response.ok) return this.save() && this.emit('expired') && this.onHandleRefreshTokenError({ response })
        this._token = await this.onHandleRefreshTokenResponse({ response })
        this.save()
        return this.getToken()
    }

    async getSystems(): Promise<SystemsResponse> {
        return await this.get({
            path: `/systems${this.generateQueryString()}`,
        })
    }

    async getSystemSummary(systemId: string): Promise<SystemSummaryResponse> {
        return await this.get({
            path: `/systems/${systemId}/summary${this.generateQueryString()}`,
        })
    }

    async getSystemDevices(systemId: string): Promise<SystemDevicesResponse> {
        return await this.get({
            path: `/systems/${systemId}/devices${this.generateQueryString()}`,
        })
    }

    generateQueryString() {
        return `?key=${Homey.env.API_KEY}`
    }
}
