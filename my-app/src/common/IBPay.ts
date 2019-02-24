import { IBPay as API } from './wallet'
import { IBPayAction } from './actions';

let debug = require('debug')
let info = debug('IBPay[INFO]');
let error = debug('IBPay[ERR]');

export class IBPay {

  private dispatch: any;

  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  public updatePaycode(): Promise<any> {
    return API.getPaycode()
      .then(code => this.updatePaycodeSuccess(code))
      .catch(err => this.updatePaycodeError(err))
  }

  private updatePaycodeSuccess(code: string) {
    info('update PayCode success', code);
    this.dispatch(IBPayAction.updatePayCode(code));
    return code
  }
  private updatePaycodeError(err: any) {
    error('update PayCode error', err);
    this.dispatch(IBPayAction.updatePayCode(''));
    return ''
  }
}