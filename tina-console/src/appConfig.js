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
apiRoot = "julien.tech"
loginRequired = false

export default API_ROOT 
export const LOGINREQUIRED = loginRequired