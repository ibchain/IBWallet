import { createStore } from "redux";
import { IBWallet } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  IBWallet,
  composeWithDevTools() // Chrome 拡張機能（Redux DevTools Extension) 用
);

export default store;
