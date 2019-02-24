
import { API } from 'aws-amplify';

let debug = require('debug')
let log = debug('[getPaycode]')

export function getPaycode(): Promise<string> {

  return new Promise((resolve, reject) => {

    log('getPaycode()')
    let apiName = 'IBCoin_User';
    let guest_path = '/paper';
    let myInit = {
      headers: {},
      response: false,
      body: {
        getCode: true
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
        // this.dispatch(onSuccessGetPayCode(res.code))
        resolve(res.code)
      })
      .catch(err => {
        log('[ERR] API.put', apiName, guest_path, myInit, err)
        log(err, err.stack);
        // this.dispatch(onSuccessGetPayCode(''))
        reject(err)
      });
  })

}