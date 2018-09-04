let apiRoot;

const origin = window && window.location && window.location.origin;

if (origin.includes(':3000')) {
    console.log(origin)
    apiRoot = origin.replace("localhost:3000", "tina.lbr.lu");
    console.log(apiRoot)
    
} else {
    apiRoot = origin.replace("console.","")
}
const API_ROOT = apiRoot
export default API_ROOT 