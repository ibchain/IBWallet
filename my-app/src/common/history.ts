import { createBrowserHistory } from "history";

const hosts = ['localhost:8080', 'caldia-apps.github.io', 'd2otoqn9rs8n0r.cloudfront.net', 'ibchain.github.io']
const hid = hosts.indexOf(window.location.hostname)
const bases = ['', '/IBWallet', '', '/IBWallet/my-app/build']
const basename = bases[hid]
const browserHistory = createBrowserHistory({ basename });

export default browserHistory;