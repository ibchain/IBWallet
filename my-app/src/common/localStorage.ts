// debug
let debug = require('debug')
let log = debug('helpers/localStorage')
log.log = console.log.bind(console)

const KEY_HAVE_LOGGED_IN = 'helpers/KEY_HAVE_LOGGED_IN'
const KEY_ADDRESS = 'helpers/KEY_ADDRESS'
/**
 * Cognito ログイン成功
 *
 * @export
 * @interface HaveLoggedIn
 */
export interface HaveLoggedIn {
  /**
   * ログイン成功フラグ
   *
   * @type {boolean}
   * @memberof HaveLoggedIn
   */
  loggedIn: boolean
  /**
   * 最終ログイン日時
   *
   * @type {Date}
   * @memberof HaveLoggedIn
   */
  lastLoggedIn: Date
}

/**
 * 過去にCognitoログインに成功したことがあるか？
 * 成功したことがある場合は true
 * ログアウト時にフラグは削除
 *
 * @export
 * @returns {boolean}
 */
export function haveLoggedIn(): HaveLoggedIn {
  const defVal: HaveLoggedIn = {
    loggedIn: false,
    lastLoggedIn: new Date(0)
  }
  const ret = getItem(KEY_HAVE_LOGGED_IN, JSON.stringify(defVal))
  return Object.assign(defVal, JSON.parse(ret))
}

/**
 * Cogtnito ログインフラグ削除
 *
 * @export
 */
export function removeLoggedInFlag(): void {
  remove(KEY_HAVE_LOGGED_IN)
}

/**
 * Cognito ログインフラグ保存
 *
 * @export
 * @param {boolean} [value=true]
 */
export function setHaveLoggedIn(value: boolean = true): void {
  let val: HaveLoggedIn = {
    loggedIn: value,
    lastLoggedIn: new Date()
  }
  setItem(KEY_HAVE_LOGGED_IN, JSON.stringify(val))
}

export interface Address {
  address?: string
  lastUpdate?: Date
}

export function getAddress(): Address {
  const val: Address = {
    address: undefined,
    lastUpdate: undefined
  }
  const defVal = JSON.stringify(val)
  const res = getItem(KEY_ADDRESS, defVal)
  const resVal = JSON.parse(res)
  return Object.assign({}, defVal, resVal)
}

export function setAddress(address: string): void {
  const val: Address = {
    address: address,
    lastUpdate: new Date()
  }
  setItem(KEY_ADDRESS, JSON.stringify(address))
}

export function removeAddress(): void {
  remove(KEY_ADDRESS)
}

export const address = {
  set: setAddress,
  get: getAddress,
  remove: removeAddress
}

/**
 * ローカルストレージに値を書き込む
 *
 * @param {string} key
 * @param {*} value
 */
function setItem(key: string, value: any) {
  if (!!localStorage && !!localStorage.setItem) {
    log('setItem()', key, value)
    localStorage.setItem(key, value)
  } else {
    log('ERR: localStorage is unabailable')
  }
}

function getItem(key: string, defaultValue: any = undefined): any {
  if (!!localStorage && !!localStorage.getItem) {
    log('getItem()', key)
    let value = localStorage.getItem(key)
    if (!!value) {
      log('getItem() => ', value)
      return value
    }
  } else {
    log('ERR: localStorage is unabailable')
  }
  log('getItem() defaultValue => ', defaultValue)
  return defaultValue
}

function remove(key: string): void {
  if (!!localStorage && !!localStorage.getItem) {
    log('remove()', key)
    localStorage.removeItem(key)
  } else {
    log('ERR: localStorage is unabailable')
  }
}