import { IBWallet as API } from './wallet'
import { IBWalletAction, Actions } from './actions';
import { Dispatch } from 'redux';
import { Hub } from 'aws-amplify';
import { SendAssetParams, SendAssetSuccess } from './wallet/sendasset';

let debug = require('debug')
let info = debug('IBWallet[INFO]');
let error = debug('IBWallet[ERR]');

/**
 * IB Wallet
 *
 * @export
 * @class IBWallet
 */
export class IBWallet {

  /**
   * dispatch
   *
   * @private
   * @type {Dispatch<Actions>}
   * @memberof IBWallet
   */
  private dispatch: Dispatch<Actions>;

  /**
   * Creates an instance of IBWallet.
   * @param {Dispatch<Actions>} dispatch
   * @memberof IBWallet
   */
  constructor(dispatch: Dispatch<Actions>) {
    this.dispatch = dispatch;
  }

  /**
   * 1. IB Wallet アドレス取得
   *
   * @memberof IBWallet
   */
  public getMyAddress = (): Promise<any> => {
    return API.getAddress()
      .then((address: string) => this.getMyAddressSuccess(address)) // 1.1
      .catch((err: any) => this.getMyAddressError(err))          // 1.2
  }

  /**
   * 1.1 成功）IB Wallet アドレス取得
   *
   * @private
   * @memberof IBWallet
   */
  private getMyAddressSuccess = (address: string) => {
    info('get address success', address);
    // Store 更新
    this.dispatch(IBWalletAction.switchAddress(address))

    // 資産更新
    this.updateBalance(address);  // 3
  }

  /**
   * 1.2 失敗）IB Wallet アドレス取得
   *
   * @private
   * @memberof IBWallet
   */
  private getMyAddressError = (err: any) => {
    error('get address error', err);
    this.dispatch(IBWalletAction.switchAddress(undefined))
  }

  /**
   * 2. 送金
   *
   * @memberof IBWallet
   */
  public sendAsset = (params: SendAssetParams) => {
    Hub.dispatch('sendAsset', { event: 'start', data: params }, 'IBWallet');
    API.sendAsset(params)
      .then((value: any) => this.sendAssetSuccess(params, value))  // 2.1
      .catch((err: any) => {
        this.sendAssetError(err)  // 2.2
        this.updateBalance(params.fromAddress) // 3
      })
  }

  /**
   * 2.1 成功）送金
   *
   * @private
   * @memberof IBWallet
   */
  private sendAssetSuccess = (params: SendAssetParams, value: SendAssetSuccess) => {
    info('sendAssetSuccess', params, value)
    // 通信は成功したが、送金が成功しているとは限らない
    // resId が文字列であれば送金成功
    const resId = value.resId
    // resId がオブジェクトで errorMessage を取得できる場合は送金失敗
    if (resId && (resId as any).errorMessage) {
      Hub.dispatch('sendAsset', { event: 'error', errorMessage: (resId as any).errorMessage }, 'IBWallet');
    } else {
      Hub.dispatch('sendAsset', { event: 'success', data: { params, value } }, 'IBWallet');
    }
    // 資産更新
    this.updateBalance(params.fromAddress); // 3
  }

  /**
   * 2.2 失敗）送金
   *
   * @private
   * @memberof IBWallet
   */
  private sendAssetError = (err: any) => {
    Hub.dispatch('sendAsset', { event: 'error', errorMessage: err }, 'IBWallet');
    error(err)
  }

  /**
   * 3. 資産更新
   *
   * @memberof IBWallet
   */
  public updateBalance = (address: string) => {
    // 資産更新
    API.getBalance(address)
      .then(this.updateBalanceSuccess)  // 3.1
      .catch(this.updateBalanceError)   // 3.2
  }

  /**
   * 3.1 成功）資産更新
   *
   * @private
   * @memberof IBWallet
   */
  private updateBalanceSuccess = (qty: number) => {
    info('update balance success', qty)
    // Store 更新
    this.dispatch(IBWalletAction.updateAsset(qty));
  }
  /**
   * 3.2 失敗）資産更新
   *
   * @private
   * @memberof IBWallet
   */
  private updateBalanceError = (err: any) => {
    error('update balance  ERR', err);
    // Store 更新
    this.dispatch(IBWalletAction.updateAsset(0));
  }
}
