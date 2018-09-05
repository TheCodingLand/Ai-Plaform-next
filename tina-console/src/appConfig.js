let apiRoot;

const origin = window && window.location && window.location.origin;

if (origin.includes(':3000')) {
    console.log(origin)
    apiRoot = origin.replace("http://localhost:3000", "tina.lbr.lu");
    console.log(apiRoot)
    
} else {
    
    apiRoot = origin.replace("http://console.","")
}
const API_ROOT = apiRoot
export default API_ROOT 