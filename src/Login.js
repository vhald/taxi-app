import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WebView} from 'react-native-webview';

// GoogleSignin.configure({
//   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//   webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   hostedDomain: '', // specifies a hosted domain restriction
//   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//   accountName: '', // [Android] specifies an account name on the device that should be used
// });
const Login = ({navigation, route}) => {
  const [state, setState] = useState({
    email: 'vhald@tuta.io',
    password: 'gyan@1998',
    loader: false,
    passwordHidden: true,
    emailTestFail: false,
    passwordTestFail: false,
  });

  const onChangeEmail = text => {
    setState(prev => ({...prev, email: text}));
  };

  const onChangePassword = text => {
    setState(prev => ({...prev, password: text}));
  };

  const onSubmit = () => {
    // email verification starts  HACK:  onBlur's logic
    const email = String(state.email).trim().toLowerCase();
    const pattern =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const emailTest = pattern.test(email);
    // setState(prev => ({...prev, emailTestFail: !pattern.test(email)}));
    if (emailTest === false) {
      setState(prev => ({...prev, emailTestFail: true}));
      return;
    }
    if (emailTest) {
      setState(prev => ({...prev, emailTestFail: false}));
    }

    // email verified

    // HACK:  password verify start - already implemented in onBlur
    const pass = String(state.password).trim();
    if (pass.length >= 6) {
      setState(prev => ({...prev, passwordTestFail: false}));
    } else {
      setState(prev => ({...prev, passwordTestFail: true}));
      return;
    }

    // TODO:  need to build the logic in which user can login with email-pass.
    // do here...

    auth()
      .signInWithEmailAndPassword(email, pass)
      .then(res => {
        var currentUser = auth().currentUser;
        // console.log('this is uid', currentUser._user.uid);

        if (currentUser !== null) {
          var uid = currentUser._user.uid;
          console.log('uid', uid);
        }
        // console.log('logged in', res.user.uid, typeof res.user);
        // toast.show('Login seems successful');
        // var uid = res.user.uid;
        AsyncStorage.setItem('@uid', uid);
        // setTimeout(() => {
        //   navigation.navigate('Home');
        // }, 1500);
        toast.show('Login was successful');
      })
      .catch(err => console.log('', err));
  };
  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    console.log('idToken: ', idToken);
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  const TermsAndCond = () => {
    return <WebView source={{uri: 'https://reactnative.dev/'}} />;
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 40,
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Image
        source={{uri: 'https://via.placeholder.com/150?text=Login'}}
        style={{
          width: 100,
          height: 50,
          marginBottom: 20,
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      />

      <TextInput
        style={{
          color: 'grey',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderColor: '#d8d8e1',
          borderWidth: 1,
          borderRadius: 16,
        }}
        onChangeText={text => onChangeEmail(text)}
        placeholder={'Type your email here'}
        placeholderTextColor={'grey'}
        // onBlur={validEmail}
        value={state.email}
      />
      {state.emailTestFail === true && (
        <Text style={{color: 'red', fontSize: 10, paddingLeft: 20}}>
          invalid email
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          alignItems: 'center',
          borderColor: '#d8d8e1',
          borderWidth: 1,
          borderRadius: 16,
        }}>
        <View
          style={{
            flex: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TextInput
            style={{
              color: 'grey',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
            onChangeText={text => onChangePassword(text)}
            value={state.password}
            secureTextEntry={state.passwordHidden}
            placeholder={'Type your password here'}
            placeholderTextColor={'grey'}
            // onBlur={validPassword}
          />
          <TouchableOpacity
            style={{paddingHorizontal: 20}}
            onPress={() => {
              setState(prev => ({
                ...prev,
                passwordHidden: !state.passwordHidden,
              }));
            }}>
            <Entypo
              name={state.passwordHidden ? 'eye' : 'eye-with-line'}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      {state.passwordTestFail && (
        <Text style={{color: 'red', fontSize: 10, paddingLeft: 20}}>
          invalid password
        </Text>
      )}

      <TouchableOpacity
        onPress={() => {
          onSubmit();
        }}
        style={{
          marginTop: 20,
          height: 56,
          backgroundColor: '#333333',
          borderRadius: 16,
          padding: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            lineHeight: 20,
            color: '#FCFCFC',
          }}>
          Login
        </Text>
      </TouchableOpacity>
      <View
        style={{
          marginTop: 40,
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 30,
        }}>
        <TouchableOpacity
          onPress={async () => {
            onGoogleButtonPress();
          }}
          style={{
            height: 60,
            width: 120,
            borderWidth: 3,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'black'}}>Google SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 60,
            width: 120,
            borderWidth: 3,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'black'}}>Google SignIn</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 50, alignSelf: 'center'}}>
        <Text style={{color: 'black', fontSize: 18}}>
          By signing in you are agreeing our
        </Text>
        <TouchableOpacity style={{color: 'blue', alignSelf: 'center'}}>
          <Text style={{color: 'blue'}}>Terms and Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
