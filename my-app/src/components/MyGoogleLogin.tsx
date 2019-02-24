import * as React from 'react';
import { connect } from 'react-redux'
import { GoogleLogin } from 'react-google-login'
import { Auth } from 'aws-amplify';
import { State } from '../common/reducer';
import { googleClientId } from '../config/params';
import { AmplifyBridge } from '../common/Amplify';
import store from '../common/store';

let debug = require('debug');
let log = debug('MyGoogleLogin');

interface MapStateProps {

}

type MyProps = MapStateProps;

class BaseMyGoogleLogin extends React.Component<MyProps, {}> {


  constructor(props: MyProps) {
    super(props);
    this.onsuccess = this.onsuccess.bind(this)
    this.onfailure = this.onfailure.bind(this)
    this.loading = this.loading.bind(this)
  }

  // コンポーネントがマウントされた時に呼ばれる
  componentDidMount() {
    log('componentDidMount')
    // ログイン処理開始イベント発光
    // this.props.actions.startGoogleLogin()
  }
  componentDidCatch(error: any, info: any) {
    log('componentDidCatch: ', error, info)
  }
  // Google ログインが成功した時に呼び出される
  async onsuccess(googleUser: any) {
    log('onsuccess: ', googleUser)
    const { id_token, expires_at } = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();
    let user = {
        email: profile.getEmail(),
        name: profile.getName()
    };
    
    const credentials = await Auth.federatedSignIn(
        'google',
        { token: id_token, expires_at },
        user
    );
    log('credentials', credentials);
    // setHaveLoggedIn()
    new AmplifyBridge(store).checkUser()
}

  // Google ログインが失敗した時に呼び出される
  onfailure(response: any) {
    log('onfailure: ', response)
    if (response && response.error) {
      if (response.error === 'popup_closed_by_user') {
        // TODO: ログイン処理中断をユーザーに案内する
      }
    }
  }

  // Google ログアウトが完了した時に呼び出される
  logout = () => {
    log('logout: ')
  }

  // Google ログイン画面が表示されるときに呼び出される
  loading = () => {
    log('loading: ')
  }
  render() {
    return (
      // <div style={{ display: 'none' }}>
        <GoogleLogin
          clientId={googleClientId}
          buttonText="新規登録、ログイン"
          scope={""}
          onSuccess={this.onsuccess}
          onFailure={this.onfailure}
          onRequest={this.loading}
          isSignedIn
        />
      // </div>
    )
  }
}
const mapState = (state: State) => {
  log("mapState", state)
  return ({
    // login: state.login
  })
}

const mapDispatch = (dispatch: any) => {
  log("mapDispatch", dispatch)
  return ({
    // actions: new ActionDispatcher(dispatch)
  })
}

export const MyGoogleLogin = connect(mapState, mapDispatch)(BaseMyGoogleLogin)
