/**
 * アクションクリエイター
 * 
 * アクションは Store を更新するために使用します。
 * Store が更新されたことにより画面の表示が更新されます。
 * 
 * Store の更新を必要としないイベント発行、処理は HUB の使用を検討します。
 */
import { Action } from 'redux';

// -----------------------------
// アクション名
// -----------------------------

/**
 * Sore を更新するためのアクション名
 */
export enum ActionNames {
  /** Google, Cognito ユーザ情報更新 */
  SWITCH_USER = 'SWITCH_USER',
  /** IB Wallet アドレス更新 */
  SWITCH_ADDRESS = 'SWITCH_ADDRESS',
  /** 未使用 */
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  /** ログアウト */
  DELETE_PROFILE = 'DELETE_PROFILE',
  /** 支払いコード更新 */
  UPDATE_PAY_CODE = 'UPDATE_PAY_CODE',
  /** 所有資産更新 */
  UPDATE_ASSET = 'UPDATE_ASSET',
  /** クーポン情報更新 */
  UPDATE_PAPER_INFO = 'UPDATE_PAPER_INFO',
}

// -----------------------------
// アクション作成用
// -----------------------------

/** Google, Cognito ユーザ情報更新 */
type UserAction = Action<ActionNames.SWITCH_USER> & { user: any }
/** ログアウト */
type DeleteProfileAction = Action<ActionNames.DELETE_PROFILE>
/** IB Wallet アドレス更新 */
type SwitchAddressAction = Action<ActionNames.SWITCH_ADDRESS> & { address?: string }
/** 支払いコード更新 */
type UpdatePayCodeAction = Action<ActionNames.UPDATE_PAY_CODE> & { code?: string }
/** 所有資産更新 */
type UpdateAssetAction = Action<ActionNames.UPDATE_ASSET> & { qty: number }
/** クーポン情報更新 */
type UpdateCouponAction = Action<ActionNames.UPDATE_PAPER_INFO> & { address?: string, qty: number, code?: string }

export type Actions = UserAction | DeleteProfileAction | SwitchAddressAction | UpdatePayCodeAction | UpdateAssetAction | UpdateCouponAction

/** 
 * Google, Cognito ユーザ情報更新 
 * 本アプリへのログイン、ＡＰＩのアクセス権限などに関するアクション
 */
export const UserActions = {
  // when user sign in / out
  switchUser: (user: any): UserAction => {
    return { type: ActionNames.SWITCH_USER, user }
  },
  // when user sign out
  deleteProfile: (): DeleteProfileAction => {
    return { type: ActionNames.DELETE_PROFILE }
  },
}

/** 
 * IB Wallet サービス関連の情報更新
 */
export const IBWalletAction = {
  /** IB Wallet アドレス更新 */
  switchAddress: (address?: string): SwitchAddressAction => {
    return { type: ActionNames.SWITCH_ADDRESS, address }
  },
  /** 所有資産更新 */
  updateAsset: (qty: number): UpdateAssetAction => {
    return { type: ActionNames.UPDATE_ASSET, qty }
  },
}

/** 
 * IB Pay サービス関連の情報更新
 */
export const IBPayAction = {
  /** 支払いコード更新 */
  updatePayCode: (code: string): UpdatePayCodeAction => {
    return { type: ActionNames.UPDATE_PAY_CODE, code }
  },
}

/** 
 * IB Coupon サービス関連の情報更新
 */
export const IBCouponAction = {
  /** クーポン情報更新 */
  updateCoupon: (params: { code: string, qty: number, address: string }): UpdateCouponAction => {
    return { type: ActionNames.UPDATE_PAPER_INFO, ...params }
  }
}
