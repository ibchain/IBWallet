import { API } from 'aws-amplify';
import { isArray } from 'util';

let debug = require('debug')
let log = debug('[getBalance]')

export function getBalance(address: string, assetName='ibcoin'): Promise<number> {

  return new Promise((resolve, _reject) => {

    let apiName = 'IBCoin_User';
    let guest_path = '/assets?address=' + address;
    let myInit = { // OPTIONAL
      headers: {},
      response: false // OPTIONAL (return the entire Axios response object instead of only response.data)
    }
    API.get(apiName, guest_path, myInit)
      .then(response => {

        log('API.get', apiName, guest_path, myInit, response)
        let bodyJson = response['body-json']
        if (isArray(bodyJson)) {
          // bodyJson = [{name: "ibcoin", assetref: "60-512-12884", qty: 9999621981}]
          // this.dispatch(onSuccessGetBalances(bodyJson))
          bodyJson.forEach(asset => {
            log(asset)
            if (asset.name === assetName) {
              return resolve(asset.qty);
            }
          });
        } else {
          log('body json is not array', bodyJson)
        }
        return resolve(0)
      })
      .catch(err => {
        log('[ERR] API.get', apiName, guest_path, myInit, err)
        return resolve(0)
      });

  })
}