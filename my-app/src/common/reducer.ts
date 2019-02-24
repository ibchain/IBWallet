import { combineReducers } from 'redux';

import { ActionNames, Actions } from './actions';
let debug = require('debug')
let log = debug('STORE');

export interface UserState {
  isLoggedIn: boolean
  isLogout: boolean
  user?: any
  address?: string
  paycode?: string
}

const InitialUser = {
  isLoggedIn: false,
  isLogout: false
}

function user(state: UserState = InitialUser, action: Actions) {
  log('state', state, action);
  const newState = Object.assign({}, state, { isLogout: false })
  switch (action.type) {
    case ActionNames.SWITCH_USER:
      newState.user = action.user;
      break;
    case ActionNames.SWITCH_ADDRESS:
      newState.address = action.address;
      break;
    case ActionNames.UPDATE_PAY_CODE:
      newState.paycode = action.code;
      break;
    case ActionNames.DELETE_PROFILE:
      return { isLoggedIn: false, isLogout: true };
    default:
      return state;
  }
  newState.isLoggedIn = !!newState.user && !!newState.address;
  log('new state', newState);
  return newState;
}

export interface AssetState {
  ibcoin: number
}

function asset(state: AssetState = { ibcoin: -1 }, action: Actions) {
  log('asset state', state)
  const newState = Object.assign({}, state)
  switch (action.type) {
    case ActionNames.UPDATE_ASSET:
      newState.ibcoin = action.qty
      break;
    case ActionNames.DELETE_PROFILE:
      return { ibcoin: -1 };
    default:
      return state;
  }
  return newState;
}

export interface CouponState {
  address?: string,
  qty: number,
  code?: string
}

const initCouponState: CouponState = {
  address: '', qty: 0, code: ''
}

function coupon(state: CouponState = initCouponState, action: Actions) {
  log('coupon state', state)
  log('coupon action', action)
  const newState = Object.assign({}, state)
  switch (action.type) {
    case ActionNames.UPDATE_PAPER_INFO:
      const { address, code, qty } = action;
      newState.address = address;
      newState.code = code;
      newState.qty = qty;
      break;
    default:
      return state;
  }
  log('coupon new state', newState)
  return newState;
}

export type State = {
  user: UserState,
  asset: AssetState,
  coupon: CouponState,
}

export const IBWallet = combineReducers({
  user, asset, coupon
});
