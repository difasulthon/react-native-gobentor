import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Button, User} from '../../components';
import {colors, showError, getData} from '../../utils';
import {DummyUser, IconErase} from '../../assets';
import {Fire} from '../../config';

let user_id;
let requestValue = false;

const MapCustomer = ({navigation}) => {
  const [region, setRegion] = useState();
  const [photo] = useState(DummyUser);
  const [latitude, setLatitude] = useState(-6.2389932);
  const [longitude, setLongitude] = useState(107.0494232);
  const [textSearch, setTextSearch] = useState('');
  // const [user] = useState({
  //   photo: DummyUser,
  //   nama: 'User satu',
  //   role: '081234567890',
  // });
  const [user] = useState(null);
  const [textButton, setTextButton] = useState('Panggil Bentor');
  // const [requestValue, setRequestValue] = useState(false);
  const [driverFound, setDriverFound] = useState(false);
  const [driverFoundID, setDriverFoundID] = useState();
  const [listDriver, setListDrive] = useState([]);
  const [uid, setUid] = useState();
  const [destName, setDestName] = useState();
  const [destLat, setDestLat] = useState();
  const [destLong, setDestLong] = useState();

  useEffect(() => {
    getUserData();
    requestLocationPermission();
  }, [requestLocationPermission]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // console.log('iPhone: ' + response);

      if (response === 'granted') {
        locateCurrentLocation();
      }
    } else {
      let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      // console.log('Android: ' + response);

      if (response === 'granted') {
        locateCurrentLocation();
      }
    }
  }, []);

  const locateCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log(JSON.stringify(position));

        let getPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };

        setRegion(getPosition);
        setLatitude(getPosition.latitude);
        setLongitude(getPosition.longitude);
      },
      error => {},
      {enableHighAccuracy: true},
    );
  };

  const onPressPlace = (regionData, latitudeData, longitudeData, nameData) => {
    setRegion(regionData);
    setLatitude(latitudeData);
    setLongitude(longitudeData);
    setDestName(nameData);
    setDestLat(latitudeData);
    setDestLong(longitudeData);
  };

  const onClearText = () => {
    setTextSearch('');
  };

  const getUserData = () => {
    getData('user').then(res => {
      setUid(res.uid);
      user_id = res.uid;
    });
  };

  const onRequest = () => {
    if (requestValue) {
      endRide();
    } else {
      requestValue = true;
      setTextButton('Mencari pengemudi...');
      const location = {
        id: uid,
        latitude: latitude,
        longitude: longitude,
      };
      const ref = Fire.database().ref('customerRequest/' + uid + '/');
      ref.set(location);

      getClosestDriver();
    }
  };

  const getClosestDriver = () => {
    if (requestValue) {
      if (driverFound !== true) {
        setDriverFound(true);
        const driverData = Fire.database().ref('driversAvailable/');
        driverData
          .once('value')
          .then(res => {
            if (res.val()) {
              const data = Object.values(res.val());
              setListDrive(data);
            }
          })
          .catch(err => {
            showError(err.message);
          });
        setTextButton('Mencari lokasi pengemudi...');
      }
    }
    // const driverLocation = Fire.database().ref('driversAvailable/');
    // const geofire = new GeoFire(driverLocation);
    // geoquery = geofire.query({
    //   center: [latitude, longitude],
    //   radius: radius,
    // });
    // geoquery.on('key_entered', function(key, location, distance) {
    //   console.log('key: ' + key);
    //   console.log('location: ' + location);
    //   if (!driverFound && requestValue) {
    //     setDriverFound(true);
    //     setDriverFoundID(key);
    //     let dest = destName;
    //     let destl = {
    //       latitude: destLat,
    //       longitude: destLong,
    //     };
    //     const driverRef = Fire.database().ref(
    //       'Users/Drivers/' + driverFoundID + '/customerRequest/',
    //     );
    //     let map = {
    //       customerRideId: uid,
    //       destination: dest,
    //       destinationLat: destl.latitude,
    //       destinationLng: destl.longitude,
    //     };
    //     driverRef.update(map);
    //     setTextButton('Mencari pengemudi...');
    //   }
    // });
    // geoquery.on('ready', function() {
    //   if (!driverFound) {
    //     setRadius(radius + 1);
    //     getClosestDriver();
    //   }
    // });
  };

  const endRide = () => {
    requestValue = false;
    Fire.database()
      .ref('customerRequest/' + user_id + '/')
      .remove();
    if (driverFoundID != null) {
      const driverRef = Fire.database().ref(
        'Users/Drivers/' + driverFoundID + '/customerRequest/',
      );
      driverRef.remove();
      setDriverFoundID(null);
    }
    setDriverFound(false);
    setListDrive([]);
    setTextButton('Panggil Bentor');
  };

  return (
    <View style={styles.page}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={region}>
        {/* {latitude && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title="Lokasi"
            description="Lokasi"
          />
        )} */}
        {/* {console.log('driver: ' + listDriver)} */}
        {listDriver.map(marker => {
          return (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.id}
              description={marker.id}>
              <Callout>
                <Text>{marker.g}</Text>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <GooglePlacesAutocomplete
        style={styles.places}
        placeholder="Enter Location"
        minLength={2}
        autoFocus={false}
        fetchDetails
        listViewDisplayed="auto"
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        onTouchCancel
        query={{
          key: '',
          language: 'en',
          types: 'geocode',
        }}
        currentLocation={false}
        onPress={(data, details = null) => {
          const regionPlace = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035,
          };
          onPressPlace(
            regionPlace,
            regionPlace.latitude,
            regionPlace.longitude,
            details.name,
          );
        }}
        textInputProps={{
          onChangeText: text => {
            setTextSearch(text);
          },
          value: textSearch,
        }}
        renderRightButton={() => (
          <TouchableOpacity onPress={onClearText}>
            <IconErase style={styles.iconErase} />
          </TouchableOpacity>
        )}
      />

      {user !== null && (
        <View style={styles.customerWrapper}>
          <User photo={photo} nama="User satu" role="081234567890" />
        </View>
      )}
      <View style={styles.button}>
        <Button title={textButton} onPress={onRequest} />
      </View>
    </View>
  );
};

export default MapCustomer;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentWrapper: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '90%',
    top: '7%',
  },
  places: {
    backgroundColor: colors.white,
    height: '50%',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  border: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  customerWrapper: {
    position: 'absolute',
    backgroundColor: colors.white,
    width: '100%',
    paddingLeft: 30,
    paddingTop: 10,
    paddingBottom: 20,
    bottom: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderTopColor: colors.border,
    borderBottomColor: colors.white,
    borderLeftColor: colors.border,
    borderRightColor: colors.border,
  },
  iconErase: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 10,
  },
});
