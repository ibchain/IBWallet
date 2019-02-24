import { createBrowserHistory } from "history";

const hosts = ['localhost:3000', 'localhost:8080', 'caldia-apps.github.io', 'd2otoqn9rs8n0r.cloudfront.net', 'ibchain.github.io']
const hid = hosts.indexOf(window.location.hostname)
const bases = ['', '', '/IBWallet', '', `${process.env.PUBLIC_URL}`]
const basename = bases[hid]
const browserHistory = createBrowserHistory({ basename });

export default browserHistory;