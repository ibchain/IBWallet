import { IBCoupon as API } from './wallet'
import { IBCouponAction, Actions } from './actions';
import { Dispatch } from 'redux';

let debug = require('debug')
let info = debug('IBCoupon[INFO]');
let error = debug('IBCoupon[ERR]');

/**
 * IB Coupon
 *
 * @export
 * @class IBCoupon
 */
export class IBCoupon {

  /**
   * dispatch
   *
   * @private
   * @type {Dispatch<Actions>}
   * @memberof IBCoupon
   */
  private dispatch: Dispatch<Actions>;

  /**
   * Creates an instance of IBCoupon.
   * @param {Dispatch<Actions>} dispatch
   * @memberof IBCoupon
   */
  constructor(dispatch: Dispatch<Actions>) {
    this.dispatch = dispatch;

  }

  /**
   * 1. クーポンコードからアドレスと金額を取得する
   *
   * @memberof IBCoupon
   */
  public getPaperBalance = (code: string) => {
    API.paperBalance(code)
      .then(this.getPaperBalanceSuccess)  // 1.1
      .catch(this.getPaperBalanceError)   // 1.2
  }

  /**
   * 1.1 成功）クーポンコードからアドレスと金額を取得する
   *
   * @private
   * @memberof IBCoupon
   */
  private getPaperBalanceSuccess = (value: { address: string, code: string, qty: number }) => {
    info(value)
    this.dispatch(IBCouponAction.updateCoupon(value))
  }
  /**
   * 1.2 失敗）クーポンコードからアドレスと金額を取得する
   *
   * @private
   * @memberof IBCoupon
   */
  private getPaperBalanceError = (err: any) => {
    error(err)
    this.dispatch(IBCouponAction.updateCoupon({ address: '', code: '', qty: -1 }))
  }

  /**
   * 2 クーポンの資産を自分のアドレス宛に送金を要求
   *
   * @memberof IBCoupon
   */
  public claimPaperAsset = (code: string, qty: number) => {
    API.claimPaperAsset(code, qty)
      .then(this.claimPaperAssetSuccess)  // 2.1
      .catch(this.claimPaperAssetError)   // 2.2
  }

  /**
   * 2.1 成功）クーポンの資産を自分のアドレス宛に送金を要求
   *
   * @private
   * @memberof IBCoupon
   */
  private claimPaperAssetSuccess = (value: any) => {
    info(value)
    // this.dispatch(IBCouponAction.updateCoupon(value))
  }
  /**
   * 2.2 失敗）クーポンの資産を自分のアドレス宛に送金を要求
   *
   * @private
   * @memberof IBCoupon
   */
  private claimPaperAssetError = (err: any) => {
    error(err)
    // this.dispatch(IBCouponAction.updateCoupon({ address: '', code: '', qty: -1 }))
  }
}
