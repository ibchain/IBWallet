import { API } from 'aws-amplify';

let debug = require('debug')
let log = debug('[paperBalance]')

/**
   * ペーパーアカウントの資産を自分のアカウントに送金
   * @param code 
   */
export function claimPaperAsset(code: string, qty: number = 0) {
  return new Promise((resolve, reject) => {

    log("claimPaperAsset", code)

    let apiName = 'IBCoin_User';
    let guest_path = '/paper';
    let myInit = { // OPTIONAL
      headers: {},
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      // body: "to=" + to + "&qty=" + qty + "&assetName=" + assetName
      body: {
        code, qty
      }
    }
    API.post(apiName, guest_path, myInit)
      .then(response => {

        log('API.post', apiName, guest_path, myInit)
        log('API.post > response =', response)
        return response
      })
      .then((res: any) => {
        log('res', res)
        // this.getBalances(res.sendTo)
        // this.dispatch(onSuccessPaperAsset(res))
        resolve(res)
      })
      .catch(err => {
        log('[ERR] API.put', apiName, guest_path, myInit, err)
        log(err, err.stack);
        // this.dispatch(onSuccessPaperAsset({ sendTo: "err", qty: 0 }))
        // this.dispatch(onFailureSendAsset(err))
        reject(err)
      });
  })
}
