import { Auth, Logger } from 'aws-amplify';
import { UserActions, Actions } from './actions';
import { IBWallet } from './IBWallet';
import { IBPay } from './IBPay';
import { Store } from 'redux';
import { State } from './reducer';

const logger = new Logger('AmplifyBridge');

/**
 * AWS Amplify に関する処理
 *
 * @export
 * @class AmplifyBridge
 */
export class AmplifyBridge {

  /**
   * Store
   * 
   * @private
   * @type {Store<State, Actions>}
   * @memberof AmplifyBridge
   */
  private store: Store<State, Actions>;

  /**
   * Creates an instance of AmplifyBridge.
   * @param {Store<State, Actions>} store Store 更新、State 取得のために使用
   * @memberof AmplifyBridge
   */
  constructor(store: Store<State, Actions>) {
    this.store = store;
  }

  /**
   * 1. ログイン中のユーザ情報を確認
   *
   * @memberof AmplifyBridge
   */
  public checkUser = () => {
    Auth.currentAuthenticatedUser()
      .then((user: any) => this.checkUserSuccess(user)) // 1.1
      .catch((err: any) => this.checkUserError(err)); // 1.2
  }

  /**
   * 1.1 成功）ログイン中のユーザ情報を確認
   *
   * @private
   * @memberof AmplifyBridge
   */
  private checkUserSuccess = (user: any) => {
    logger.info('check user success', user);
    this.loadUserInfo(user);                  // 2
  }

  /**
   * 1.2 失敗）ログイン中のユーザ情報を確認
   *
   * @private
   * @memberof AmplifyBridge
   */
  private checkUserError = (err: any) => {
    logger.info('check user error', err);
    // Store からユーザ情報削除
    // this.store.dispatch(UserActions.switchUser(null)); // deleteProfile でユーザ情報は削除される

    // Store からデータを削除し、ログアウトフラグを設定
    this.store.dispatch(UserActions.deleteProfile());
  }

  /**
   * 2. Cognito ユーザ情報取得
   *
   * @private
   * @memberof AmplifyBridge
   */
  private loadUserInfo = (user: any) => {
    Auth.currentUserInfo()
      .then((info: any) => this.loadUserInfoSuccess(user, info))   // 2.1
      // ログイン情報が取得できているので、ユーザ情報が取得できる。想定されないエラー
      .catch((err: any) => this.loadUserInfoUserError(user, err)); // 2.2 
  }
  /**
   * 2.1 成功）Cognito ユーザ情報取得
   *
   * @private
   * @memberof AmplifyBridge
   */
  private loadUserInfoSuccess = (user: any, info: any) => {

    logger.info('load user info success', user, info);
    // ログイン情報とユーザ情報を合わせて
    Object.assign(user, info);
    // Store に保存
    this.store.dispatch(UserActions.switchUser(user));

    // IB Wallet アドレスを更新
    this.updateAddress(); // 3
  }

  /**
   * 2.2 失敗）Cognito ユーザ情報取得
   *
   * @private
   * @memberof AmplifyBridge
   */
  private loadUserInfoUserError = (user: any, err: any): any => {
    logger.error('load user info success', user, err);
    throw new Error("Method not implemented.");
  }


  /**
   * 3. IB Wallet アドレス更新
   *
   * @private
   * @memberof AmplifyBridge
   */
  private updateAddress = () => {

    // 取得済みであれば更新する必要はない
    const state = this.store.getState();
    if (state.user && !state.user.address) {
      logger.info('アドレスを更新します・・・・・・・・・・・・・・・・・')
      new IBWallet(this.store.dispatch).getMyAddress()
        .then(() => this.updatePaycode()); // 4
    }
  }

  /**
   * 4. 支払いコード更新
   *
   * @private
   * @memberof AmplifyBridge
   */
  private updatePaycode = () => {
    logger.info('支払いコードを更新します・・・・・・・・・・・・・・・・・')

    new IBPay(this.store.dispatch).updatePaycode()
      .then((code: string) => logger.info('IBPay.updatePaycode result > ', code))
  }

  /**
   * 10. ログアウト
   *
   * @memberof AmplifyBridge
   */
  public logout = () => {
    Auth.signOut()
    .then(this.logoutSuccess)   // 10.1
    .catch(this.logoutError)    // 10.2
  }

  /**
   * 10.1 成功）ログアウト
   *
   * @private
   * @memberof AmplifyBridge
   */
  private logoutSuccess = (value: any) => {
    logger.info('ログアウト', value)

    // Store の情報を削除し、ログアウトフラグを設定
    this.store.dispatch(UserActions.deleteProfile())
  }

  /**
   * 10.2 失敗）ログアウト
   *
   * @private
   * @memberof AmplifyBridge
   */
  private logoutError = (err: any) => {
    // ここが呼び出されることはないだろうが、ログアウト処理を続行する
    logger.error('ログアウトエラー', err)

    // Store の情報を削除し、ログアウトフラグを設定
    this.store.dispatch(UserActions.deleteProfile())
  }
}

