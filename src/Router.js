import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Alert, Platform} from 'react-native';

// import Login from './Login';

import Map from './Map';
import Booking from './Booking';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import auth from '@react-native-firebase/auth';
// import messaging from '@react-native-firebase/messaging';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Cart from './PaymentPage';

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
//
// GoogleSignin.configure({
//   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//   webClientId: '532670997875-mj37543c9geth49a6p4s51ecqvqo0nhb.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   hostedDomain: '', // specifies a hosted domain restriction
//   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//   accountName: '', // [Android] specifies an account name on the device that should be used
//   iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
//   openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });

const Stack = createNativeStackNavigator();

//start from here
const Router = props => {
  // const [state, setstate] = useState({loading: true, currentUser: null});

  // useEffect(() => {
  //   auth().onAuthStateChanged(user => {
  //     if (user) {
  //       var uid = user.uid;
  //       //console.log('uid onAuthStateChanged',uid)
  //       setstate(prev => ({...prev, currentUser: uid, loading: false}));
  //       getToken();
  //     } else {
  //       //console.log('user is signout')
  //       setstate(prev => ({...prev, currentUser: null, loading: false}));
  //     }
  //   });

  //   getRequest();

  //   // when you app will be in the foreground
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     // if(remoteMessage.data.url === 'google'){
  //     //
  //     // }
  //   });

  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     //console.log('Message handled in the background!', remoteMessage);
  //   });

  //   askPermissions();
  // }, []);

  // const askPermissions = async () => {
  //   if (Platform.OS == 'ios') {
  //     //iphone
  //     //check(PERMISSIONS.IOS.)
  //   } else {
  //     //android
  //     try {
  //       let checked = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  //       console.log('checked', checked);
  //       if (checked !== 'granted') {
  //         checked = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  //         console.log('checked now', checked);
  //       }
  //     } catch (error) {
  //       console.log('error to get location', error);
  //     }
  //   }
  // };

  // const getRequest = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     //console.log('Authorization status:', authStatus);
  //     getToken();
  //   }
  // };

  // const getToken = () => {
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       //console.log('token for notifications',token)
  //       // if(auth().currentUser === null){
  //       //     firestore().collection('unregistedusers').add({ token: token })
  //       // }
  //       // else {
  //       //   firestore().collection('users').doc(auth().currentUser.uid).update({ token: token })
  //       // }
  //     })
  //     .catch(error => {
  //       //console.log('erro to get a token',error)
  //     });

  //   //taxi > employees, drivers , customers // all
  //   messaging()
  //     .subscribeToTopic('customers')
  //     .then(() => {
  //       //console.log('subscribeed to topic customers')
  //     });
  // };

  // const loginPage = () => {
  //   const currentUser = auth().currentUser;
  //   //console.log('currentUser on router page',currentUser)
  //   setstate(prev => ({...prev, currentUser, loading: false}));
  // };

  // const isGoogleSigned = async () => {
  //     const isSignedIn = await GoogleSignin.isSignedIn();
  //     console.log('isSignedIn',isSignedIn)
  //
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     //this.setState({ userInfo });
  //     //setUserData(userInfo)
  //     const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
  //    // Sign-in the user with the credential
  //    //auth().signInWithCredential(googleCredential);
  //    setState(prev => ({...prev, currentUser: googleCredential }))
  //
  //
  //     console.log('userInfo',userInfo)
  //   } catch (error) {
  //     console.log('error',error)
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  //
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="map">
        {/* <Stack.Screen
          name="booking"
          options={{headerShown: false}}
          component={Booking}
        /> */}
        <Stack.Screen
          name="map"
          options={{headerShown: false}}
          component={Map}
        />
        <Stack.Screen
          name="cart"
          options={{headerShown: false}}
          component={Cart}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
