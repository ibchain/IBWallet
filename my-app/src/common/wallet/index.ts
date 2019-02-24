import { getAddress } from './getaddress';
import { getBalance } from './getbalance';
import { getPaycode } from './getpaycode';
import { sendAsset } from './sendasset';
import { paperBalance } from './paperbalance';
import { claimPaperAsset } from './claimpaperasset';

export const IBWallet = {
  getAddress,
  getBalance,
  sendAsset,
}

export const IBPay = {
  getPaycode,
}

export const IBCoupon = {
  paperBalance,
  claimPaperAsset
}

export const IBExplore = {

}