import base64js from 'base64-js';

export function base64urlToUint8array(base64Bytes) {
    const padding = '===='.substring(0, (4 - (base64Bytes.length % 4)) % 4);
    return base64js.toByteArray((base64Bytes + padding).replace(/\//g, "_").replace(/\+/g, "-"));
}
export function uint8arrayToBase64url(bytes) {
    if (bytes instanceof Uint8Array) {
        return base64js.fromByteArray(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    } else {
        return uint8arrayToBase64url(new Uint8Array(bytes));
    }
}
export function checkStatus(response) {
    if (response.status !== 200) {
        console.log("an error occurred: ", response.body);
    } else {
        return response;
    }
}
export function initialCheckStatus(response) {
    checkStatus(response);
    return response.data;
}