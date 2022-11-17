import React, {useEffect, useState, useRef} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';

const os_type = Platform.OS;
import _ from 'lodash';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width, height, scale} = Dimensions.get('window');

const PAGE_WIDTH = Dimensions.get('window').width;
const PAGE_HEIGHT = Dimensions.get('window').height;
const ASPECT_RATIO = PAGE_WIDTH / PAGE_HEIGHT;

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import DatePicker from 'react-native-datepicker';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ActionSheet from 'react-native-action-sheet';

import Moment from 'moment';
import Toast from 'react-native-simple-toast';

//import DeviceInfo from 'react-native-device-info'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
// import CountryPicker, {
//   getAllCountries
// } from 'react-native-country-picker-modal'

//const NORTH_AMERICA = ['CA', 'MX', 'US']

// const NORTH_AMERICA = ["AU","NZ","SG","MY","ID","US","GB","IT","DE","PH", "AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","IO","VG","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CK","CR","HR","CU","CW","CY","CZ","CD","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","HN","HK","HU","IS","IN","IR","IQ","IE","IM","IL","CI","JM","JP","JE","JO","KZ","KE","KI","XK","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NI","NE","NG","NU","NF","KP","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PN","PL","PT","PR","QA","CG","RO","RU","RW","RE","BL","KN","LC","MF","PM","VC","WS","SM","SA","SN","RS","SC","SL","SX","SK","SI","SB","SO","ZA","GS","KR","SS","ES","LK","SD","SR","SJ","SZ","SE","CH","SY","ST","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","UM","VI","UY","UZ","VU","VA","VE","VN","WF","EH","YE","ZM","ZW","AX"]

// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import RNGooglePlaces from 'react-native-google-places';
import Modal from 'react-native-modal';

//import haversine from 'haversine';
// import axios from 'axios';
import {SafeAreaProvider} from 'react-native-safe-area-context';

//import Autocomplete from 'react-native-autocomplete-input';

import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Animated,
  Marker,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import MomentTimeZone from 'moment-timezone';

import Geocoder from 'react-native-geocoding';

import {check, PERMISSIONS, request} from 'react-native-permissions';

Geocoder.init('AIzaSyAtXBJn9EracKsQE26guO0eg3I-FnL8HuE');

const App = () => {
  var list = null;
  const mainScroll = useRef(null);
  const tripfromRef = useRef(null);
  const triptoRef = useRef(null);
  const _mapView = useRef(null);

  const [state, setState] = useState({
    loading: false,
    loadingtypeoverlay: true,
    tripfrom: '',
    tripto: '',
    thedate: Moment().format('DD-MM-YYYY'),
    maxdate: Moment().add(1, 'years').format('DD-MM-YYYY'),
    thetime: Moment().format('hh:mm A'),
    triptype: 'One Way Trip',
    tripwheelchair: 'No',
    tripnopassengers: null,
    cca2: 'AU',
    callingCode: '61',

    tripfrom_test: null,
    tripto_test: null,
    tripnopassengers_test: null,

    tripfromfocused: false,
    triptofocused: false,
    tripnopassengersfocused: false,
    spinner: false,
    flightno: '',

    modalVisible: false,
    modalTrip: null,

    tripfromData: null,
    triptoData: null,
    tripfromDetails: null,
    triptoDetails: null,

    latitudeFrom: null,
    longitudeFrom: null,
    latitudeTo: null,
    longitudeTo: null,

    locationtextinput: false,

    listViewDisplayed: false,
    listViewDisplayedTo: false,

    tripfromtext: '',
    triptotext: '',
    comments: '',
    ipaddress: '',

    /*and here we insert googlemap*/
    LATITUDE_DELTA: 0.005,
    LONGITUDE_DELTA: 0.005 * ASPECT_RATIO,

    LATITUDE_DELTA_J: 0.005,
    LONGITUDE_DELTA_J: 0.005 * ASPECT_RATIO,

    initialPosition: {
      latitude: 29.8613648,
      longitude: 77.8598063,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005 * ASPECT_RATIO,
    },

    region: {
      latitude: 29.8613648,
      longitude: 77.8598063,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005 * ASPECT_RATIO,
    },
    area: 'Roorkee, Uttarakhand, India',
    //area: 'Yamuna Nagar, Haryana, India',
    //area: 'Sydney Airport (SYD), Sydney NSW, Australia'
    coordinate: {
      latitude: 29.8613648,
      longitude: 77.8598063,
    },
    showMap: false,
    loadingText: false,
    fetchGeoAddress: false, //false or true
    mapHeight: 340,
    hideMap: false,

    tripfromPlaceholder: 'Sydney Airport (SYD), Sydney NSW, Australia',
    triptoPlaceholder: 'Pearl Beach, New South Wales 2256, Australia',

    currentStep: 'step1',
    step1: true,
    step2: false,
    step3: false,

    tempDisable: true, // I do not want to remove few things so using this var
    enableDone1: false, //done button disable or enable
    enableDone2: false,
    enableDone3: false,
  });

  useEffect(() => {
    componentDidMount();
  }, []);

  const componentDidMount = async () => {
    //console.log('width height',width,height);
    const granted = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (granted !== 'granted') {
      try {
        const req = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('granted>', req);
      } catch (err) {
        console.warn(err);
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        console.log('getLocation()=> current position', position);

        var LATITUDE_DELTA = state.LATITUDE_DELTA;
        var LONGITUDE_DELTA = state.LONGITUDE_DELTA;

        setState(prev => ({
          ...prev,
          region: {
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coordinate: {
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
          },
        }));

        // Geocoder.from([Number(position.coords.latitude), Number(position.coords.longitude)])
        // .then(sourceGeocodes => {
        //     //console.log('Geocoder=>',sourceGeocodes, JSON.stringify(sourceGeocodes), );
        //     if ( sourceGeocodes.status == 'OK' && typeof sourceGeocodes.results !== 'undefined' && Array.isArray(sourceGeocodes.results) && sourceGeocodes.results[0] &&  typeof sourceGeocodes.results[0].formatted_address !== 'undefined'  ){
        //       console.log('yay init')
        //       this.setState({ tripfrom: sourceGeocodes.results[0].formatted_address  })
        //     }
        // })
        // .catch(error => {
        //     console.log('Error to get address',error)
        // })
      },
      error => {
        console.log('error geolocation', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
    );

    //this.enableLocation()

    // Geolocation.getCurrentPosition((position) => {
    //   console.log('heyxxxx',position)
    //
    // })
    //console.log(Moment().add(1,'years').format("DD-MM-YYYY"))

    // DeviceInfo.getIpAddress().then(ipaddress => {
    //   console.log('ipaddress =>',ipaddress)
    //   this.setState({ ipaddress })
    // });

    //-33.93992280000001 151.1752764 -33.5394673 151.3101744
    // axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=-33.93992280000001,151.1752764&destinations=-33.5394673,151.3101744&key=AIzaSyAZkGfsjFxon3edOfwsW5BQqxSXfXXlO7A`)
    // .then(response => {
    //   console.log('response.data>',response.data)
    // })

    //var cordinatedSnap = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=null,150.9444269&destinations=-33.542,151.308&key=AIzaSyAZkGfsjFxon3edOfwsW5BQqxSXfXXlO7A`)

    // .then(response => {
    //   var cordinated = response.data
    //   console.log('cordinated map',cordinated)
    //console.log('1', typeof cordinated.rows[0].elements !== 'undefined' &&   cordinated.rows[0].elements.status !== 'undefined' );
    //console.log('2', typeof cordinated.rows[0].elements[0].distance !== 'undefined' && typeof cordinated.rows[0].elements[0].distance.text !== 'undefined' );
    //
    //   console.log(typeof cordinated.status !== 'undefined'  && cordinated.status === 'OK' && typeof cordinated.rows !== 'undefined' && typeof cordinated.rows[0] !== 'undefined' && typeof cordinated.rows[0].elements !== 'undefined' && typeof cordinated.rows[0].elements[0] !== 'undefined' && typeof cordinated.rows[0].elements[0].distance !== 'undefined' && cordinated.rows[0].elements[0].distance !== null && typeof cordinated.rows[0].elements[0].distance.text !== 'undefined' && cordinated.rows[0].elements[0].distance.text !== null);
    // })
    // .catch(error => {
    //   console.log('error >',error)
    // })

    // console.log('current',Moment().format("DD-MM-YYYY"))
    // console.log('current 2',Moment().add(1,'years').format("DD-MM-YYYY"))
    // console.log('current',Moment().format("hh-mm:A"))
    //console.log(!isNaN(parseInt('hithere')))
    // setInterval(() => {
    //       this.setState({
    //         spinner: !state.spinner
    //       });
    //     }, 3000);

    mainScroll.props.scrollToPosition(0, 640);
  };

  //v2
  const enableLocation = () => {
    if (Platform.OS == 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          console.log('hi', data);
        })
        .catch(err => {
          console.log('err', err);
        });
    }
  };

  //v2
  const _onRegionChangeComplete = Region => {
    console.log('Region', Region);
    setState(prev => ({
      ...prev,
      region: Region,
      LATITUDE_DELTA: Region.latitudeDelta,
      LONGITUDE_DELTA: Region.longitudeDelta,
    }));

    if (state.fetchGeoAddress) {
      var trigger = setTimeout(() => {
        setState(prev => ({...prev, loadingText: true}));
        Geocoder.from([Region.latitude, Region.longitude])
          .then(sourceGeocodes => {
            console.log(
              'Geocoder=>',
              sourceGeocodes,
              JSON.stringify(sourceGeocodes),
            );
            if (
              sourceGeocodes.status == 'OK' &&
              typeof sourceGeocodes.results !== 'undefined' &&
              Array.isArray(sourceGeocodes.results) &&
              sourceGeocodes.results[0] &&
              typeof sourceGeocodes.results[0].formatted_address !== 'undefined'
            ) {
              console.log('yay');
              if (state.currentStep === 'step1') {
                setState(prev => ({
                  ...prev,
                  loadingText: false,
                  tripfromData: sourceGeocodes,
                  tripfrom: sourceGeocodes.results[0].formatted_address,
                  tripfromPlaceholder:
                    sourceGeocodes.results[0].formatted_address,
                }));
              } else if (state.currentStep === 'step2') {
                setState(prev => ({
                  ...prev,
                  loadingText: false,
                  triptoData: sourceGeocodes,
                  tripto: sourceGeocodes.results[0].formatted_address,
                  triptoPlaceholder:
                    sourceGeocodes.results[0].formatted_address,
                }));
              }
            }
          })
          .catch(error => {
            setState(prev => ({...prev, loadingText: false}));
            console.log('Error to get address', error);
          });
      }, 1);
    }
  };

  const getLatfromAddress = address => {
    Geocoder.from(address)
      .then(sourceGeocodes => {
        if (
          sourceGeocodes.status == 'OK' &&
          typeof sourceGeocodes.results !== 'undefined' &&
          Array.isArray(sourceGeocodes.results) &&
          sourceGeocodes.results[0] &&
          typeof sourceGeocodes.results[0].geometry !== 'undefined'
        ) {
          console.log('geomatry', sourceGeocodes.results[0].geometry.location);
          //this.setState({ loadingText: false, tripfrom: sourceGeocodes.results[0].formatted_address  })
          //this.setState({   })
          // this.setState({
          //
          //   region: {
          //       latitude: 29.8613648,
          //       longitude: 77.8598063,
          //       latitudeDelta: 0.005,
          //       longitudeDelta: 0.005 * ASPECT_RATIO,
          //     },
          //     coordinate: {
          //       latitude: 29.8613648,
          //       longitude: 77.8598063
          //      }
          //
          // })
        }
      })
      .catch(error => {
        console.log('Error to get address', error);
      });
  };

  //v2
  const corToreg = () => {
    var region = state.coordinate;
    setState(prev => ({
      ...prev,
      region: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: state.LATITUDE_DELTA,
        longitudeDelta: state.LONGITUDE_DELTA,
      },
      dragging: false,
    }));
  };

  const toggleFetchGeoAddress = () => {
    var fetchGeoAddress = !state.fetchGeoAddress;
    setState(prev => ({...prev, fetchGeoAddress}));
  };

  const onPassengerNumberChanged = e => {
    if (/^\d+$/.test(e.toString())) {
      setState(prev => ({...prev, tripnopassengers: e}));
    }
  };

  const openWheelChairType = () => {
    var BUTTONSiOS = ['Yes', 'No', 'Cancel'];
    var BUTTONSandroid = ['Yes', 'No'];
    var CANCEL_INDEX = 2;
    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: 'blue',
      },
      buttonIndex => {
        console.log('button clicked :', buttonIndex);
        if (buttonIndex === 0) {
          setState(prev => ({...prev, tripwheelchair: 'Yes'}));
        } else if (buttonIndex === 1) {
          setState(prev => ({...prev, tripwheelchair: 'No'}));
        } else {
          //do nothing
        }
      },
    );
  };

  const openTripType = () => {
    var BUTTONSiOS = ['Round Trip', 'One Way Trip', 'Cancel'];
    var BUTTONSandroid = ['Round Trip', 'One Way Trip'];
    var CANCEL_INDEX = 2;
    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: 'blue',
      },
      buttonIndex => {
        console.log('button clicked :', buttonIndex);
        if (buttonIndex === 0) {
          setState(prev => ({...prev, triptype: 'Round Trip'}));
        } else if (buttonIndex === 1) {
          setState(prev => ({...prev, triptype: 'One Way Trip'}));
        } else {
          //do nothing
        }
      },
    );
  };

  const submitForm = async () => {
    //this.ref.scrollView.scrollTo({ x: 0, y: 100, animated: true })
    //this.list.scrollTo({x: 0, y: 100})
    //     setTimeout(() => {
    //     this.list.scrollTo({x: 100});
    // }, 1);

    // console.log('this.tripfrom=>',this.tripfrom, String(this.tripfrom).length)
    //   console.log('this.tripto=>',this.tripto, String(this.tripto).length)
    //
    //   console.log('state.tripfrom=>',state.tripfrom)
    //     console.log('state.tripto=>',state.tripto)

    setState(prev => ({
      ...prev,
      loading: true,
      tripfrom_test: null,
      tripto_test: null,
    }));

    var user = auth().currentUser;

    var tripfrom = String(state.tripfrom).trim();
    var tripto = String(state.tripto).trim();
    var tripnopassengers = parseInt(String(state.tripnopassengers).trim());
    console.log(isNaN(tripnopassengers), tripfrom.length, tripto.length);

    var submit = true;

    if (tripfrom.length == 0) {
      if (String(tripfromRef.current).length < 3) {
        console.log('shouldnt you come here ');
        submit = false;
        setState(prev => ({...prev, tripfrom_test: false, loading: false}));
      } else {
        //this.setState({ tripfrom: this.tripfrom })
        //await this.setStateAsync({ tripfrom: this.tripfrom });
        setState(prev => ({...prev, tripfrom: tripfromRef.current}));
        tripfrom = tripfromRef.current;
      }
    } else {
      if (tripfrom === tripfromRef.current) {
        //do nothing
      } else {
        if (String(tripfromRef.current).length < 3) {
          console.log('shouldnt you come here ');
          submit = false;
          setState(prev => ({...prev, tripfrom_test: false, loading: false}));
        } else {
          //this.setState({ tripfrom: this.tripfrom })
          //await this.setStateAsync({ tripfrom: this.tripfrom });
          setState(prev => ({...prev, tripfrom: tripfromRef.current}));
          tripfrom = tripfromRef.current;
        }
      }
    }

    if (tripto.length == 0) {
      if (String(triptoRef.current).length < 3) {
        console.log('shouldnt you come here ');
        submit = false;
        setState(prev => ({...prev, tripto_test: false, loading: false}));
      } else {
        //this.setState({ tripfrom: this.tripfrom })
        //await this.setStateAsync({ tripto: this.tripto });
        setState(prev => ({...prev, tripto: triptoRef.current}));
        tripto = triptoRef.current;
      }
    } else {
      if (tripto === triptoRef.current) {
        //do nothing
      } else {
        if (String(triptoRef.current).length < 3) {
          console.log('shouldnt you come here ');
          submit = false;
          setState(prev => ({...prev, tripto_test: false, loading: false}));
        } else {
          //this.setState({ tripto: this.tripto })
          //await this.setStateAsync({ tripto: this.tripto });
          setState(prev => ({...prev, tripto: triptoRef.current}));
          tripto = triptoRef.current;
        }
      }
    }

    //console.log('state.tripfrom',state.tripfrom, state.tripto )

    // if ( tripfrom.length == 0  || String(this.tripfrom).length < 3   ){
    //   console.log('shouldnt you come here ')
    //   submit = false
    //   this.setState({ tripfrom_test : false , loading: false })
    // }

    // if ( tripto.length == 0 || String(this.tripto).length < 3  ){
    //   console.log('shouldnt you come here 2')
    //   submit = false
    //   this.setState({ tripto_test : false, loading: false })
    // }

    if (isNaN(tripnopassengers) || tripnopassengers < 1) {
      submit = false;
      setState(prev => ({
        ...prev,
        tripnopassengers_test: false,
        loading: false,
      }));
      //this.ref.scrollView.scrollTo({ x: 0, y: 100, animated: true })
      //ref={'scroll'}
      // if ( this.scrollViewRef){
      //   console.log('do yo scroll')
      //   this.scrollViewRef.scrollTo({ y: 50 })
      // }
      //this.scrollViewRef.scrollTo({ y: 50 })
      //this.refs.scroll.scrollTo({ y: 50 })
    }

    console.log('tripnopassengers', tripnopassengers);

    // if (  isNaN(tripnopassengers) || tripfrom.length == 0 || tripto.length == 0 ){
    //     Toast.show('All fields are required')
    //     this.setState({ loading: false })
    //     return;
    // }
    if (submit === false) {
      return;
    } else {
      //console.log(state.latitudeFrom,state.longitudeFrom,state.latitudeTo,state.longitudeTo);

      //console.log('haversine =>',haversine({ latitude: state.latitudeFrom, longitude: state.longitudeFrom }, { latitude: state.latitudeTo, longitude: state.longitudeTo }))
      //return
      const tripday = Moment(state.thedate, 'DD-MM-YYYY').format('dddd');
      console.log('tripday');

      firestore()
        .collection('users')
        .doc(user.uid)
        .collection('bookings')
        .add({
          tripfrom,
          tripto,
          tripnopassengers,
          thedate: state.thedate,
          thetime: state.thetime,
          triptype: state.triptype,
          tripwheelchair: state.tripwheelchair,
          tripday,
          status: 'Pending',
          date_created: Moment().format('x'),
          date_created_human: Moment().format('DD-MM-YYYY hh:mm A'),
          paid20: false,
          flightno: state.flightno,
          latitudeFrom: state.latitudeFrom,
          longitudeFrom: state.longitudeFrom,
          latitudeTo: state.latitudeTo,
          longitudeTo: state.longitudeTo,
          duration: null,
          distance: null,
          comments: state.comments,
          platform: Platform.OS,
        })
        .then(response => {
          Toast.show('Booking Added Successfully');
          setState(prev => ({
            ...prev,
            tripfrom: '',
            tripto: '',
            loading: false,
          }));
          //Actions.expmybookings()
        })
        .catch(error => {
          Toast.show(
            'There is some problem to perform this operation right now.',
          );
          setState(prev => ({...prev, loading: false}));
        });
    } //else
  };

  // setStateAsync(state) {
  //   return new Promise((resolve) => {
  //     this.setState(state, resolve)
  //   });
  // }

  const Validtripnopassengers = text => {
    var email = parseInt(text);
    console.log('email=>', email);
    if (email === null) {
      //parseInt(String(state.tripnopassengers).trim())
      email = String(state.tripnopassengers).trim().toLowerCase();
    }
    //var email = String(state.email).trim().toLowerCase()
    if (email.length === 0)
      setState(prev => ({...prev, tripnopassengersfocused: false}));
    //const re = /^[0-9]$/;
    setState(prev => ({...prev, tripnopassengers_test: !isNaN(email)}));
  };

  // const openSearchModal = () => {
  //   RNGooglePlaces.openAutocompleteModal()
  //     .then(place => {
  //       console.log(place);
  //       // place represents user's selection from the
  //       // suggestions and it is a simplified Google Place object.
  //     })
  //     .catch(error => console.log(error.message)); // error is a Javascript Error object
  // };

  //const self = this;
  const homePlace = {
    description: 'Home',
    geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
  };
  const workPlace = {
    description: 'Work',
    geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
  };

  const mapWidth = width;
  //const mapHeight = 400;

  return (
    <SafeAreaProvider style={styles.container}>
      {state.loadingtypeoverlay === true && (
        <Spinner
          visible={state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      )}

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        innerRef={ref => {
          mainScroll.current = ref;
        }}>
        {state.loading && state.loadingtypeoverlay === false && (
          <ActivityIndicator animating size="large" />
        )}

        <View>
          <View style={styles.mylocationbutton}>
            <TouchableOpacity onPress={() => this.corToreg()}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons name="my-location" size={34} color="#79aaff" />
              </View>
            </TouchableOpacity>
          </View>
          <MapView
            ref={mapview => {
              _mapView.current = mapview;
            }}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{marginTop: 1, height: state.mapHeight, width: mapWidth}}
            showsTraffic
            region={state.region}
            onRegionChangeComplete={_onRegionChangeComplete}>
            {/*  <Marker
             ref={marker => {
              this._marker = marker;
             }}
             coordinate={state.coordinate}
           />*/}
          </MapView>
          {state.hideMap === false && state.currentStep === 'step1' && (
            <Image
              source={{uri: 'https://via.placeholder.com/150'}}
              style={{
                position: 'absolute',
                zIndex: 999,
                top: state.mapHeight / 2 - 30,
                left: width / 2 - 20,
                height: 35,
                width: 35,
              }}
            />
          )}

          {state.hideMap === false && state.currentStep === 'step2' && (
            <Image
              source={{uri: 'https://via.placeholder.com/150'}}
              style={{
                position: 'absolute',
                zIndex: 999,
                top: state.mapHeight / 2 - 30,
                left: width / 2 - 20,
                height: 35,
                width: 35,
              }}
            />
          )}
        </View>

        {state.currentStep === 'step1' && (
          <View style={{paddingHorizontal: 23, paddingTop: 20}}>
            <Text style={{fontSize: 15, color: 'black', paddingBottom: 0}}>
              Pickup Address
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 6.5}}>
                {state.locationtextinput === true ? (
                  <TextInput
                    placeholder="Sydney Airport (SYD), Sydney NSW, Australia"
                    style={{
                      paddingBottom: 6,
                      fontSize: 17,
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1,
                    }}
                    onChangeText={tripfrom =>
                      setState(prev => ({
                        ...prev,
                        tripfrom,
                        tripfrom_test: null,
                      }))
                    }
                    value={state.tripfrom}
                  />
                ) : (
                  <GooglePlacesAutocomplete
                    listViewDisplayed={state.listViewDisplayed}
                    enablePoweredByContainer={false}
                    placeholder={state.tripfromPlaceholder}
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      console.log('details', details);
                      console.log('data', data);

                      var description = data.description;
                      if (
                        typeof data.structured_formatting !== 'undefined' &&
                        typeof data.structured_formatting.main_text !==
                          'undefined' &&
                        data.structured_formatting.main_text !== null
                      ) {
                        description = data.structured_formatting.main_text;
                      }
                      tripfrom.current = description;
                      // //this.getLatfromAddress(data.description)
                      setState(prev => ({
                        ...prev,
                        tripfrom: description,
                        tripfromData: data,
                        tripfromDetails: details,
                        latitudeFrom: details.geometry.location.lat,
                        longitudeFrom: details.geometry.location.lng,
                        listViewDisplayed: false,
                        tripfrom_test: null,
                      }));

                      // this.setState({ region: {
                      //       latitude: details.geometry.location.lat,
                      //       longitude: details.geometry.location.lng,
                      //       latitudeDelta: state.LATITUDE_DELTA,
                      //       longitudeDelta: state.LONGITUDE_DELTA
                      //   } })
                    }}
                    getDefaultValue={() => ''}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: 'AIzaSyAtXBJn9EracKsQE26guO0eg3I-FnL8HuE',
                      language: 'en', // language of the results
                      //types: '(cities)' // default: 'geocode'
                      location: '-33.847927,150.651771',
                      radius: 100,
                      components: 'country:au',
                      strictbound: true,
                      types: [
                        'geocode',
                        'address',
                        'establishment',
                        '(cities)',
                        '(regions)',
                      ],
                    }}
                    styles={{
                      textInputContainer: {
                        width: '100%',
                        borderTopWidth: 0,
                        backgroundColor: '#ffffff',
                        borderBottomWidth: 1,
                        borderBottomColor: 'grey',
                      },
                      textInput: {
                        borderRadius: 0,
                        paddingLeft: 0,
                        marginLeft: 0,
                        fontSize: 15,
                      },

                      predefinedPlacesDescription: {
                        color: '#1faadb',
                      },
                      listView: {
                        marginLeft: 0,
                        paddingLeft: 0,
                      },
                    }}
                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={
                      {
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                      }
                    }
                    // GooglePlacesSearchQuery={{
                    //   // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    //   rankby: 'distance',
                    //   type: 'cafe'
                    // }}
                    GooglePlacesDetailsQuery={
                      {
                        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                        //fields: 'formatted_address',
                      }
                    }
                    filterReverseGeocodingByTypes={[
                      'locality',
                      'administrative_area_level_3',
                    ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    //predefinedPlaces={[homePlace, workPlace]}
                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    //renderLeftButton={()  => <Icon size={22} name="chevron-left" /> }
                    //renderRightButton={() => <Icon size={22} name="chevron-right" />}
                    textInputProps={{
                      onFocus: () => {
                        console.log('onFocus');
                        setState(prev => ({
                          ...prev,
                          tripfrom_test: null,
                          mapHeight: 70,
                          hideMap: true,
                        }));
                      },
                      onBlur: () => {
                        console.log('blurred');
                        setState(prev => ({
                          ...prev,
                          listViewDisplayed: false,
                          mapHeight: 400,
                          hideMap: false,
                        }));
                      },
                      onChangeText: text => {
                        console.log('text=>', text);
                        //self.setState({ tripfromtext: text });
                      },
                    }}
                    ref={element => {
                      if (element) {
                        //disableitfornow  tripfromRef.current = element.refs.textInput._getText()
                        console.log('this.tripfrom', tripfromRef.current);
                      }
                    }}
                  />
                )}

                {state.tripfrom_test === false && (
                  <Text style={{color: 'red', fontSize: 11}}>
                    Please type your pickup address
                  </Text>
                )}
              </View>
              <View>
                <Icon
                  style={{paddingVertical: 5}}
                  size={22}
                  name="map-marker"
                  color="#F29A00"
                />
              </View>
            </View>
            {/*
                  <TouchableOpacity  style={{   borderTopWidth: 0.2, borderTopColor: 'grey', paddingVertical: 15, paddingLeft: 10 }}><Text style={{ color: '#5CB8F6' }}>Current Location</Text></TouchableOpacity>
                  <TouchableOpacity  style={{  borderTopWidth: 0.5, borderTopColor: 'grey', paddingVertical: 12, paddingLeft: 10 }}><Text>Set location on map</Text></TouchableOpacity>
                  <TouchableOpacity  style={{  borderTopWidth: 0.5, borderTopColor: 'grey', paddingVertical: 12, paddingLeft: 10 }}><Text>Home</Text></TouchableOpacity>
                  <TouchableOpacity  style={{  borderTopWidth: 0.5, borderTopColor: 'grey', paddingVertical: 12, paddingLeft: 10 }}><Text>Work</Text></TouchableOpacity>
                  */}
          </View>
        )}

        {state.currentStep === 'step2' && (
          <View style={{paddingHorizontal: 23, paddingTop: 20}}>
            <Text style={{fontSize: 15, color: 'black', paddingBottom: 0}}>
              Drop Off Address
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 6.5}}>
                {state.locationtextinput === true ? (
                  <TextInput
                    placeholder="Pearl Beach, New South Wales 2256, Australia"
                    style={{
                      paddingVertical: 6,
                      fontSize: 17,
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1,
                    }}
                    onChangeText={tripto =>
                      setState(prev => ({...prev, tripto, tripto_test: null}))
                    }
                    value={state.tripto}
                  />
                ) : (
                  <GooglePlacesAutocomplete
                    listViewDisplayed={state.listViewDisplayedTo}
                    enablePoweredByContainer={false}
                    placeholder={state.triptoPlaceholder}
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      var description = data.description;
                      if (
                        typeof data.structured_formatting !== 'undefined' &&
                        typeof data.structured_formatting.main_text !==
                          'undefined' &&
                        data.structured_formatting.main_text !== null
                      ) {
                        description = data.structured_formatting.main_text;
                      }
                      tripto.current = description;
                      setState(prev => ({
                        ...prev,
                        tripto: description,
                        triptoData: data,
                        triptoDetails: details,
                        latitudeTo: details.geometry.location.lat,
                        longitudeTo: details.geometry.location.lng,
                        listViewDisplayedTo: false,
                        tripto_test: null,
                      }));
                    }}
                    getDefaultValue={() => ''}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: 'AIzaSyAtXBJn9EracKsQE26guO0eg3I-FnL8HuE',
                      language: 'en', // language of the results
                      // types: '(cities)' // default: 'geocode'
                      location: '-33.847927,150.651771',
                      radius: 100000,
                      components: 'country:au',
                      strictbound: true,
                      types: [
                        'geocode',
                        'address',
                        'establishment',
                        '(cities)',
                        '(regions)',
                      ],
                    }}
                    styles={{
                      textInputContainer: {
                        width: '100%',
                        borderTopWidth: 0,
                        backgroundColor: '#ffffff',
                        borderBottomWidth: 1,
                        borderBottomColor: 'grey',
                      },
                      textInput: {
                        borderRadius: 0,
                        paddingLeft: 0,
                        marginLeft: 0,
                        fontSize: 15,
                      },

                      predefinedPlacesDescription: {
                        color: '#1faadb',
                      },
                      listView: {
                        marginLeft: 0,
                        paddingLeft: 0,
                      },
                    }}
                    //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    //currentLocationLabel="Current location"
                    nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={
                      {
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                      }
                    }
                    // GooglePlacesSearchQuery={{
                    //   // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    //   rankby: 'distance',
                    //   type: 'cafe'
                    // }}
                    GooglePlacesDetailsQuery={{
                      // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                      fields: 'formatted_address',
                    }}
                    filterReverseGeocodingByTypes={[
                      'locality',
                      'administrative_area_level_3',
                    ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    //predefinedPlaces={[homePlace, workPlace]}
                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    //renderLeftButton={()  => <Icon size={22} name="chevron-left" /> }
                    //renderRightButton={() => <Icon size={22} name="chevron-right" />}

                    textInputProps={{
                      onFocus: () => {
                        console.log('onFocus');
                        setState(prev => ({
                          ...prev,
                          tripto_test: null,
                          hideMap: true,
                        }));
                      },
                      onBlur: () => {
                        console.log('blurred');
                        setState(prev => ({
                          ...prev,
                          listViewDisplayedTo: false,
                          hideMap: false,
                        }));
                      },
                      onChangeText: text => {
                        console.log('text=>', text);
                      },
                    }}
                    ref={element => {
                      if (element) {
                        tripto.current = element.refs.textInput._getText();
                        console.log('this.tripto', tripto);
                      }
                    }}
                  />
                )}
                {state.tripto_test === false && (
                  <Text style={{color: 'red', fontSize: 11}}>
                    Please type your drop off address
                  </Text>
                )}
              </View>
              <View>
                <Icon
                  style={{paddingVertical: 5}}
                  size={22}
                  name="map-marker"
                  color="#F29A00"
                />
              </View>
            </View>
          </View>
        )}

        {(state.currentStep === 'step1' || state.currentStep === 'step2') && (
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 10,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 4,
                backgroundColor: '#EAEAEA',
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
                minWidth: 70,
              }}>
              <MaterialIcons size={22} name="my-location" color="#F29A00" />
              <Text style={{fontSize: 10}}>Current</Text>
              <Text style={{fontSize: 10}}>Location</Text>
            </TouchableOpacity>
            {state.fetchGeoAddress ? (
              <TouchableOpacity
                onPress={() => this.toggleFetchGeoAddress()}
                style={{
                  borderRadius: 4,
                  backgroundColor: 'orange',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  minWidth: 70,
                }}>
                <Icon size={22} name="map-marker" color="white" />
                <Text
                  style={{fontSize: 10, textAlign: 'center', color: 'white'}}>
                  Set location {'\n'} on map
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.toggleFetchGeoAddress()}
                style={{
                  borderRadius: 4,
                  backgroundColor: '#EAEAEA',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  minWidth: 70,
                }}>
                <Icon size={22} name="map-marker" color="#F29A00" />
                <Text style={{fontSize: 10, textAlign: 'center'}}>
                  Set location {'\n'} on map
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                borderRadius: 4,
                backgroundColor: '#EAEAEA',
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
                minWidth: 70,
              }}>
              <Icon size={22} name="home" color="#F29A00" />
              <Text style={{fontSize: 10}}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 4,
                backgroundColor: '#EAEAEA',
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
                minWidth: 70,
              }}>
              <Icon size={22} name="suitcase" color="#F29A00" />
              <Text style={{fontSize: 10}}>Work</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{marginTop: 10, alignItems: 'center'}}>
          {state.currentStep === 'step1' && (
            <View>
              {state.tripfromData !== null ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({currentStep: 'step2', step2: true});
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#474747',
                    width: width - 40,
                    height: 50,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 16, color: '#EAFAFA'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#EAEAEA',
                    width: width - 40,
                    height: 50,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 16, color: '#EAFAFA'}}>
                    Done
                  </Text>
                </View>
              )}
            </View>
          )}

          {state.currentStep === 'step2' && (
            <View>
              {state.triptoData !== null ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({currentStep: 'step3', step3: true});
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#474747',
                    width: width - 40,
                    height: 50,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 16, color: '#EAFAFA'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#EAEAEA',
                    width: width - 40,
                    height: 50,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 16, color: '#EAFAFA'}}>
                    Done
                  </Text>
                </View>
              )}
            </View>
          )}

          {state.currentStep === 'step3' && (
            <View>
              {state.triptoData !== null ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({currentStep: 'step3', step3: true});
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#474747',
                    width: width - 40,
                    height: 50,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 16, color: '#EAFAFA'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#EAEAEA',
                    width: width - 40,
                    height: 50,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 16, color: '#EAFAFA'}}>
                    Done
                  </Text>
                </View>
              )}
            </View>
          )}

          <View
            style={{
              marginTop: 10,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 10, color: '#777'}}>Pick Up</Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'orange',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 16}}>1</Text>
              </TouchableOpacity>
            </View>

            <Text style={{marginTop: 10, fontSize: 22, color: 'grey'}}>
              {' '}
              ...{' '}
            </Text>

            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 10, color: '#777'}}>Drop Off</Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: state.step2 ? 'orange' : '#EAEAEA',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: state.step2 ? 'white' : 'black'}}>2</Text>
              </TouchableOpacity>
            </View>

            <Text style={{marginTop: 10, fontSize: 22, color: 'grey'}}>
              {' '}
              ...{' '}
            </Text>

            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 10, color: '#777'}}>Book Now</Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: state.step3 ? 'orange' : '#EAEAEA',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: state.step3 ? 'white' : 'black'}}>3</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{height: 10}} />
      </KeyboardAwareScrollView>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#F29A00',
    position: 'absolute',
    marginTop: 40,
    left: PAGE_WIDTH / 2 - 80,
    borderRadius: 50,
    alignItems: 'center',
    bottom: 30,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
  },
  buttonText: {
    margin: 9,
    marginLeft: 40,
    marginRight: 40,
    color: '#fff',
    fontSize: 13,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  mylocationbutton: {
    backgroundColor: '#EAEAEA',
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    top: 15,
    zIndex: 999,
    width: 34,
    height: 34,
  },

  pickuproute: {
    backgroundColor: '#EAEAEA',
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    top: 60,
    zIndex: 999,
    width: 34,
    height: 34,
  },
});
