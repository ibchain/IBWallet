import { API } from 'aws-amplify';

let debug = require('debug')
let log = debug('[getAddress]')

export function getAddress(): Promise<string> {

  return new Promise((resolve, reject) => {
    log("アドレス取得のAPIを呼び出します")
    let apiName = 'IBCoin_User';
    let guest_path = '/address';
    let myInit = { // OPTIONAL
      headers: {},
      response: false // OPTIONAL (return the entire Axios response object instead of only response.data)
    }
    API.get(apiName, guest_path, myInit)
      .then(response => {

        log('API.get', apiName, guest_path, myInit, response)
        let bodyJson = response['body-json']
        let address = ''
        if (bodyJson) {
          address = bodyJson
          resolve(address);
        }
      })
      .catch(err => {
        log('[ERR] API.get', apiName, guest_path, myInit, err)
        reject(err);
      });

  })
}
