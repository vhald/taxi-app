import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {check, PERMISSIONS, request} from 'react-native-permissions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';

import Modal from 'react-native-modal';
import Moment from 'moment';
import toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ASPECT_RATIO = windowWidth / windowHeight;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
Geocoder.init('AIzaSyAtXBJn9EracKsQE26guO0eg3I-FnL8HuE');

const App = () => {
  const initialRegion = {
    latitude: 30.2891458,
    longitude: 77.9940181,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };
  const [coordinates, set_coordinates] = useState(initialRegion);
  const [grantedPermission, set_grantedPermission] = useState(false); //true , false
  const [currentLocation, set_currentLocation] = useState(null);

  const [whereLocation, set_whereLocation] = useState(null); //save from address in human format
  const [whereLocationLatLong, set_whereLocationLatLong] = useState(null); // save From address in lat long

  const [toLocation, set_toLocation] = useState(null); //save address in human format
  const [toLocationLatLong, set_toLocationLatLong] = useState(null); //save Destination address in lat long

  const [step, setStep] = useState(1);

  const [extraData, set_extraData] = useState({
    email: '',
    name: '',
    travelDate: 12312312,
    travelDateinHuman: new Date(),
    numberofpassengers: 3,
  });

  const [autoCompleteModal, set_autoCompleteModal] = useState(false);

  useEffect(() => {
    locationPermission();
  }, []);

  useEffect(() => {
    console.log('coordinates', coordinates);
  }, [coordinates]);

  const locationPermission = async () => {
    let granted = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (granted !== 'granted') {
      try {
        granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('granted', granted);
        set_grantedPermission(granted);
      } catch (err) {
        console.warn(err);
      }
    } else {
      set_grantedPermission(true);
    }
  };

  useEffect(() => {
    console.log('coordinates', coordinates);
    if (grantedPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log('position', position);
          set_currentLocation(position);
          getAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          )
            .then(res => {
              console.log('that is my current location', res);
              set_whereLocation(res);
              set_whereLocationLatLong([
                position.coords.latitude,
                position.coords.longitude,
              ]);
            })
            .catch(err => {
              console.log('err', err);
            });
          set_coordinates(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );

      // getAddressFromCoordinates(coordinates)
      // .then(res => {
      //     console.log('that is my current location',res)
      // }).catch(err => {
      //     console.log('err',err)
      // })
    }
  }, [grantedPermission]);

  const getAddressFromCoordinates = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          'AIzaSyAtXBJn9EracKsQE26guO0eg3I-FnL8HuE',
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson', responseJson);
          if (responseJson.status === 'OK') {
            resolve(responseJson?.results?.[0]?.formatted_address);
          } else {
            reject('not found');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const changedLocation = newPosition => {
    set_coordinates(newPosition);
    setTimeout(() => {
      getAddressFromCoordinates(newPosition.latitude, newPosition.longitude)
        .then(res => {
          console.log('that is my current location', res);
          if (step == 1) {
            set_whereLocation(res);
            set_whereLocationLatLong([
              newPosition.latitude,
              newPosition.longitude,
            ]);
          } else {
            set_toLocation(res);
            set_toLocationLatLong([
              newPosition.latitude,
              newPosition.longitude,
            ]);
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    }, 200);
  };

  const submitForm = () => {
    firestore()
      .collection('bookings')
      .add({
        // currentUser: auth().currentUser._user.uid,
        ...extraData,
        whereLocation,
        whereLocationLatLong,
        toLocation,
        toLocationLatLong,
        status: 'pending',
      })
      .then(res => {
        toast.show('Booking saved');
        //a page ... user will show up
      })
      .catch(error => {
        console.log('');
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {currentLocation == null ? (
        <Text style={{color: 'black'}}>Fetching current location..</Text>
      ) : (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            region={coordinates}
            onRegionChangeComplete={changedLocation}
            style={{width: windowWidth, height: windowHeight}}></MapView>

          <View
            style={{
              position: 'absolute',
              top: windowHeight / 2 - 25,
              left: windowWidth / 2 - 25,
            }}>
            {step == 1 ? (
              <AntDesign name={'user'} size={30} color={'black'} />
            ) : (
              <Entypo name={'location-pin'} size={40} color={'tomato'} />
            )}
          </View>

          {/*card*/}
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              backgroundColor: 'rgba(255,255,255,0.97)',
              height: 200,
              elevation: 2,
              padding: 10,
              bottom: 0,
            }}>
            {step === 1 && (
              <>
                <Text style={{color: 'black'}}>From Where: </Text>
                <TouchableOpacity
                  onPress={() => set_autoCompleteModal(!autoCompleteModal)}
                  style={{
                    backgroundColor: '#e5e5e5',
                    borderRadius: 5,
                    width: windowWidth - 20,
                    height: 46,
                    padding: 2,
                  }}>
                  <Text style={{color: 'black', fontSize: 14}}>
                    {whereLocation}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStep(2);
                    if (toLocationLatLong !== null) {
                      set_coordinates(prev => ({
                        ...prev,
                        latitude: toLocationLatLong[0],
                        longitude: toLocationLatLong[1],
                      }));
                    }
                  }}
                  style={{
                    marginTop: 20,
                    height: 40,
                    borderRadius: 2,
                    width: windowWidth - 20,
                    backgroundColor: '#3c3c92',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={{color: 'black'}}>Destination: </Text>
                <TouchableOpacity
                  onPress={() => set_autoCompleteModal(!autoCompleteModal)}
                  style={{
                    backgroundColor: '#e5e5e5',
                    borderRadius: 5,
                    width: windowWidth - 20,
                    height: 46,
                    padding: 2,
                  }}>
                  <Text style={{color: 'black', fontSize: 14}}>
                    {toLocation}
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setStep(1);
                      set_coordinates(prev => ({
                        ...prev,
                        latitude: whereLocationLatLong[0],
                        longitude: whereLocationLatLong[1],
                      }));
                    }}
                    style={{
                      height: 40,
                      borderRadius: 2,
                      width: windowWidth / 2 - 40,
                      backgroundColor: '#3c3c92',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white'}}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={toLocationLatLong === null}
                    onPress={() => {
                      setStep(3);
                    }}
                    style={{
                      height: 40,
                      borderRadius: 2,
                      width: windowWidth / 2 - 40,
                      backgroundColor:
                        toLocationLatLong === null
                          ? 'rgba(60,60,146,0.4)'
                          : '#3c3c92',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white'}}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </>
      )}

      {/* autocomplete Modal */}
      <Modal
        onBackButtonPress={() => set_autoCompleteModal(!autoCompleteModal)}
        isVisible={autoCompleteModal}
        style={{padding: 0, margin: 0}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails={true}
            autoFocus={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              if (step === 1) {
                set_whereLocation(data.description);
                set_whereLocationLatLong([
                  details.geometry.location.lat,
                  details.geometry.location.lng,
                ]);
              }
              if (step === 2) {
                set_toLocation(data.description);
                set_toLocationLatLong([
                  details.geometry.location.lat,
                  details.geometry.location.lng,
                ]);
              }
              set_coordinates(prev => ({
                ...prev,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              }));
              set_autoCompleteModal(!autoCompleteModal);
              console.log(
                data.description,
                details.geometry.location.lat,
                details.geometry.location.lng,
              );
            }}
            query={{
              key: 'AIzaSyAtXBJn9EracKsQE26guO0eg3I-FnL8HuE',
              language: 'en', // language of the results
              location: '29.8360121,77.8829914',
              radius: 100,
              components: 'country:in',
              strictbound: true,
              types: [
                'geocode',
                'address',
                'establishment',
                '(cities)',
                '(regions)',
              ],
            }}
            styles={styles.googleauto}
            enablePoweredByContainer={false}
          />
        </View>
      </Modal>

      {/* step3 , extra details */}
      <Modal isVisible={step === 3} style={{padding: 0, margin: 0}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              elevation: 3,
              padding: 5,
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => setStep(2)} style={{marginTop: 3}}>
              <Ionicons name="arrow-back" size={30} color={'black'} />
            </TouchableOpacity>
            <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
              Add Info
            </Text>
          </View>

          <View style={{padding: 15}}>
            <TextInput
              value={extraData.name}
              placeholderTextColor={'grey'}
              placeholder="Enter your name*"
              onChangeText={name => set_extraData(prev => ({...prev, name}))}
              style={{
                color: 'black',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'grey',
              }}
            />

            <TextInput
              value={extraData.email}
              placeholderTextColor={'grey'}
              placeholder="Enter your email*"
              onChangeText={email => set_extraData(prev => ({...prev, email}))}
              style={{
                color: 'black',
                marginTop: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'grey',
              }}
            />

            <TextInput
              editable={false}
              value={String(extraData.travelDateinHuman).toString()}
              style={{
                color: 'black',
                marginTop: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'grey',
              }}
            />

            <TextInput
              keyboardType={'numeric'}
              value={extraData.numberofpassengers}
              onChangeText={numberofpassengers =>
                set_extraData(prev => ({...prev, numberofpassengers}))
              }
              style={{
                color: 'black',
                marginTop: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'grey',
              }}
            />

            <TouchableOpacity
              style={{
                backgroundColor: 'black',
                marginTop: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'grey',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={submitForm}>
              <Text>Submit</Text>
            </TouchableOpacity>

            {/*
                  <DateTimePicker
                  testID="dateTimePicker"
                  maximumDate={Moment().add(3, 'months').toDate()}
                  minimumDate={new Date()}
                  value={extraData.travelDateinHuman}
                  is24Hour
                  onChange={(date) => {setState(prev => ({travelDateinHuman: date})) }}
                />
                */}
          </View>
          {/* travel date */}
          {/* number of passengers */}
          {/* phone */}
          {/* name */}
          {/* submit */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  googleauto: {
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
      color: 'black',
      paddingLeft: 4,
    },

    predefinedPlacesDescription: {
      color: '#1faadb',
    },
    listView: {
      marginLeft: 0,
      paddingLeft: 0,
      color: 'black',
    },
    row: {
      color: 'black',
    },
    description: {
      color: 'black',
    },
    predefinedPlacesDescription: {
      color: 'black',
    },
  },
});

export default App;
