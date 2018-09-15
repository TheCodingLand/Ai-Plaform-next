import config from './config.js'

let apiRoot;
let loginRequired
const origin = window && window.location && window.location.origin;

if (origin.includes(':3000')) {
    console.log(origin)
    apiRoot = origin.replace("http://localhost:3000", "tina.lbr.lu");
    loginRequired = true
    console.log(apiRoot)
    
} else {
    
    apiRoot = origin.replace("http://console.","")
    loginRequired = true
}
const API_ROOT = apiRoot

//overrides for julien.tech test env
https = config.https
apiRoot = config.apiRoot
loginRequired = config.loginRequired

export default API_ROOT 
export const HTTPS = https
export const LOGINREQUIRED = loginRequired