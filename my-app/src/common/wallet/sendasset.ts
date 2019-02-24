
import { API } from 'aws-amplify';

let debug = require('debug')
let log = debug('[getPaycode]')

export interface SendAssetParams {
  to: string
  qty: number
  assetName: string
  fromAddress: string
}
export interface SendAssetSuccess 
{ to: string, qty: number, resId: number }

export function sendAsset(params: SendAssetParams): Promise<{ to: string, qty: number, resId: number }> {

  return new Promise((resolve, reject) => {

    log("sendAsset", params)

    let apiName = 'IBCoin_User';
    let guest_path = '/assets';
    let myInit = { // OPTIONAL
      headers: {},
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      // body: "to=" + to + "&qty=" + qty + "&assetName=" + assetName
      body: {
        to: params.to,
        qty: params.qty,
        assetName: params.assetName
      }
    }
    API.post(apiName, guest_path, myInit)
      .then(response => {

        log('API.post', apiName, guest_path, myInit)
        log('API.post > response =', response)
        // 成功した場合 response はトランザクションID文字列のみが返ってくる
        let id = response
        if (id) {
          // this.dispatch(onSuccessSendAsset({ to: params.to, qty: params.qty, resId: id }))
          return resolve({ to: params.to, qty: params.qty, resId: id })
        } else {
          // this.dispatch(onFailureSendAsset(new Error('UNKNOWN ERROR')))
          return reject(new Error('UNKNOWN ERROR'))
        }
        // return params.fromAddress
      })
      .catch(err => {
        log('[ERR] API.put', apiName, guest_path, myInit, err)
        // log(err, err.stack);
        // this.dispatch(onFailureSendAsset(err))
        return reject(err)
      });
  })

}
