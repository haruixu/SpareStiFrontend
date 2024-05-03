import base64js from 'base64-js'
import { type AxiosResponse } from 'axios'

export function base64urlToUint8array(base64Bytes: string): Uint8Array {
    const padding = '===='.substring(0, (4 - (base64Bytes.length % 4)) % 4)
    return base64js.toByteArray((base64Bytes + padding).replace(/\//g, '_').replace(/\+/g, '-'))
}

export function uint8arrayToBase64url(bytes: Uint8Array | ArrayBuffer | number[]): string {
    if (bytes instanceof Uint8Array) {
        return base64js
            .fromByteArray(bytes)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
    } else {
        return uint8arrayToBase64url(new Uint8Array(bytes))
    }
}

export function checkStatus(response: AxiosResponse<any>): AxiosResponse<any> | undefined {
    if (response.status !== 200) {
        console.log('an error occurred: ', response.statusText)
        return undefined
    } else {
        return response
    }
}

export function initialCheckStatus(response: AxiosResponse<any>): any {
    checkStatus(response)
    return response.data
}
