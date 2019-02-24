import { API } from 'aws-amplify';

let debug = require('debug')
let log = debug('[paperBalance]')

/**
 * ペーパーアカウントにある資産取得
 * @param code 
 */
export function paperBalance(code: string): Promise<{ code: string, address: string, qty: number }> {

  return new Promise((resolve, reject) => {

    log("paperBalance", code)

    let apiName = 'IBCoin_User';
    let guest_path = '/paper';
    let myInit = { // OPTIONAL
      headers: {
        'paper_code': code
      },
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      // body: "to=" + to + "&qty=" + qty + "&assetName=" + assetName
      body: {
        // code: code
      }
    }
    API.get(apiName, guest_path, myInit)
      .then(response => {

        log('API.get', apiName, guest_path, myInit)
        log('API.get > response =', response)
        return response
      })
      .then((res: any) => {
        log('res', res)
        // this.dispatch(onSuccessGetPaperInfo(code, res.address, res.qty))
        const { address, qty } = res
        resolve({ code, address, qty })
      })
      .catch(err => {
        log('[ERR] API.get', apiName, guest_path, myInit, err)
        log(err, err.stack);
        // this.dispatch(onSuccessGetPaperInfo(code, "error", 0))
        reject(err)
      });
  })

}
