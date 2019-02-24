/* reactとreact-domの読み込み */
import * as React from 'react'
// import store from '../store'
// import { MyState as WalletState } from '../modules/wallet/Reducer'
import { connect } from 'react-redux'
// import { ActionNames } from '../modules/background/ActionsNames';
import { isArray } from 'util';
// import { ActionNames } from '../modules/wallet/ActionDispatcher';

let debug = require('debug')
let log = debug('MyAsset:log');
log.log = console.log.bind(console);



/**
 * 資産表示コンポーネントのプロパティ
 *
 * @interface MyProps
 */
interface MyProps {
  asset: {ibcoin: number}
}
/**
 * 資産表示コンポーネント
 *
 * @class MyAsset
 * @extends {React.Component<MyProps>}
 */
const MyAsset: React.FC<MyProps> = (props) => {

  log("render", props)

  const { asset } = props

  if (asset.ibcoin < 0) {
    return (
      <div style={{ display: 'inline' }}>{'更新中'}</div>
    )
  }
  const { ibcoin } = asset
  return (
    <div style={{ display: 'inline' }}>{ibcoin}</div>
  )
}

const mapState = (state: any) => {
  log("mapState", state)
  return ({
    // mystate: state.mystate
    asset: state.asset
  })
}

// function getAsset(assets: Array<any>, assetName: string): string {
//   log('getAsset[ ' + assetName + ' ]')

//   if (!assetName) return 'NO DATA[E010]'
//   if (!isArray(assets)) return 'NO DATA[E100]'

//   let _assets = assets.filter((value: any) => {
//     return (value && value.name === assetName)
//   }
//   )

//   log('assets = ', _assets)
//   if (!_assets || _assets.length <= 0) return 'NO DATA'

//   if (0 < _assets.length) {
//     let asset = _assets[0]
//     if (!asset) {
//       asset = _assets[_assets.length - 1]
//     }
//     return '' + asset.qty
//   } else {
//     return '0'
//   }
// }


/** 資産表示コンポーネント */
export const RdxMyAsset = connect(mapState)(MyAsset)
