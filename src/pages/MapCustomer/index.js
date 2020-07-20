import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GeoFire} from 'geofire';
import {Button, User} from '../../components';
import {colors, showError, getData} from '../../utils';
import {DummyUser, IconErase} from '../../assets';
import {Fire} from '../../config';

let user_id;

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
  const [requestValue, setRequestValue] = useState(false);
  const [listDriver, setListDrive] = useState([]);
  const [uid, setUid] = useState();

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

  const onRegionChange = (regionData, latitudeData, longitudeData) => {
    setRegion(regionData);
    setLatitude(latitudeData);
    setLongitude(longitudeData);
  };

  const onClearText = () => {
    setTextSearch('');
  };

  const getUserData = () => {
    getData('user').then(res => {
      console.log(res);
      setUid(res.uid);
      user_id = res.uid;
    });
  };

  const onRequest = () => {
    if (requestValue) {
      endRide();
    } else {
      console.log('onRequest');
      console.log('uid: ' + uid);
      setRequestValue(true);
      setTextButton('Mencari pengemudi...');
      const location = {
        latitude: latitude,
        longitude: longitude,
      };
      const ref = Fire.database().ref('customerRequest/');
      const geofire = new GeoFire(ref);
      geofire.set(uid, [location.latitude, location.longitude]);

      getClosestDriver();
    }
  };

  const getClosestDriver = () => {
    Fire.database()
      .ref('driversAvailable/')
      .once('value')
      .then(res => {
        if (res.val()) {
          const data = res.val();
          setListDrive(Object.values(data));
        }
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const endRide = () => {
    setRequestValue(false);
    setTextButton('Panggil Bentor');
    Fire.database()
      .ref('customerRequest/' + user_id + '/')
      .remove();
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
        {console.log('driver: ' + listDriver.l)}
        {listDriver.map(marker => {
          <Marker
            key={marker.g}
            coordinate={{
              latitude: marker.l[0],
              longitude: marker.l[1],
            }}>
            <Callout>
              <Text>{marker.g}</Text>
            </Callout>
          </Marker>;
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
          onRegionChange(
            regionPlace,
            regionPlace.latitude,
            regionPlace.longitude,
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
