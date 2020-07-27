import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getPreciseDistance} from 'geolib';
import {Button, User} from '../../components';
import {colors, showError, getData, fonts} from '../../utils';
import {DummyUser, IconErase} from '../../assets';
import {Fire} from '../../config';

let user_id;
let requestValue = false;
let driverFoundID;
let driverLat = 1;
let driverLng = 1;

const MapCustomer = ({navigation}) => {
  const [region, setRegion] = useState();
  const [photo] = useState(DummyUser);
  const [latitude, setLatitude] = useState(-6.2389932);
  const [longitude, setLongitude] = useState(107.0494232);
  const [textSearch, setTextSearch] = useState('');
  const [user, setUser] = useState(null);
  const [textButton, setTextButton] = useState('Panggil Bentor');
  const [driverFound, setDriverFound] = useState(false);
  const [uid, setUid] = useState();
  const [destName, setDestName] = useState();
  const [destLat, setDestLat] = useState(1);
  const [destLong, setDestLong] = useState(1);

  useEffect(() => {
    getUserData();
    requestLocationPermission();
  }, [requestLocationPermission]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (response === 'granted') {
        locateCurrentLocation();
      }
    } else {
      let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (response === 'granted') {
        locateCurrentLocation();
      }
    }
  }, []);

  const locateCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
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
              data.map(value => {
                driverLat = value.latitude;
                driverLng = value.longitude;
                driverFoundID = value.id;
                setDataDriver(value.id, value.latitude, value.longitude);
                setDriverLocation(value.latitude, value.longitude);
              });
            }
          })
          .catch(err => {
            showError(err.message);
          });
        getDriverInfo();
        setTextButton('Mencari lokasi pengemudi...');
      }
    }
  };

  const setDriverLocation = (latData, lngData) => {
    driverLat = latData;
    driverLng = lngData;
    const distance = getPreciseDistance(
      {latitude: latitude, longitude: longitude},
      {latitude: driverLat, longitude: driverLng},
    );
    getDriverLocation(distance);
  };

  const setDataDriver = (idData, latData, lngData) => {
    driverFoundID = idData;
    driverLat = latData;
    driverLng = lngData;
    const driverRef = Fire.database().ref(
      'Users/Drivers/' + driverFoundID + '/customerRequest/',
    );
    const data = {
      customerRideId: uid,
      destination: destName,
      destinationLat: destLat,
      destinationLng: destLong,
    };
    driverRef.update(data);
  };

  const getDriverLocation = distanceData => {
    setTextButton('Pengemudi Ditemukan');

    if (distanceData < 100) {
      setTextButton('Pengemudi disini');
    } else {
      setTextButton(`Pengemudi ditemukan: ${distanceData}`);
    }
  };

  const getDriverInfo = () => {
    const driverRef = Fire.database().ref(
      'Users/Drivers/' + driverFoundID + '/',
    );
    driverRef
      .once('value')
      .then(res => {
        if (res.val()) {
          setUser(res.val());
        }
      })
      .catch(err => {
        showError(err.message);
      });
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
      driverFoundID = null;
    }
    setDriverFound(false);
    setUser(null);
    setDestName();
    setDestLat(1);
    setDestLong(1);
    driverLat = 1;
    driverLng = 1;
    setTextButton('Panggil Bentor');
  };

  return (
    <View style={styles.page}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={region}>
        {driverLat && (
          <Marker
            coordinate={{
              latitude: driverLat,
              longitude: driverLng,
            }}
            title="Driver"
            description="Driver"
          />
        )}
        {latitude && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title="Pickup"
            description="Pickup"
          />
        )}
        {destLat && (
          <Marker
            coordinate={{
              latitude: destLat,
              longitude: destLong,
            }}
            title="Pickup"
            description="Pickup"
          />
        )}
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
          <Text style={styles.textPrice}>Rp 5000</Text>
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
  textPrice: {
    fontFamily: fonts.primary[700],
    color: colors.text.primary,
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 30,
  },
});
