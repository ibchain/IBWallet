import Amplify from 'aws-amplify';

export default function amplifyConfigure() {
  Amplify.configure({
    'aws_appsync_authenticationType': 'OPENID_CONNECT',
    Auth: {
      identityPoolId: 'ap-northeast-1:xxxxxxxxxxxxxxxxxxxxxxxxxxx', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'ap-northeast-1', // REQUIRED - Amazon Cognito Region
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'ap-northeast-1_xxxxxxxxxx',
      // OPTIONAL - Amazon Cognito Web Client ID
      userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    },
    API: {
      endpoints: [
        {
          name: "xxxxxxxxxxxxxx",
          endpoint: "https://xxxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com",
          region: "ap-northeast-1"
        }
      ]
    }
  });
}