import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {Button, User} from '../../components';
import {colors, getData} from '../../utils';
import {DummyUser} from '../../assets';
import {Fire} from '../../config';
import {GeoFire} from 'geofire';

let uid;

const MapDriver = ({navigation}) => {
  const [region, setRegion] = useState();
  const [photo] = useState(DummyUser);
  const [latitude, setLatitude] = useState(-6.2389932);
  const [longitude, setLongitude] = useState(107.0494232);
  // const [user] = useState({
  //   photo: DummyUser,
  //   nama: 'User satu',
  //   role: '081234567890',
  // });
  const [user] = useState(null);

  useEffect(() => {
    getUserData();

    const fetchLocation = setInterval(() => {
      requestLocationPermission();
      setDriverAvailable();
    }, 1000);

    return () => {
      clearInterval(fetchLocation);
      disconnectDriver();
    };
  }, [requestLocationPermission, setDriverAvailable, navigation]);

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

  const setDriverAvailable = useCallback(() => {
    const location = {
      id: uid,
      latitude: latitude,
      longitude: longitude,
    };
    const refAvailable = Fire.database().ref('driversAvailable/' + uid + '/');
    refAvailable.set(location);
  }, [latitude, longitude]);

  const disconnectDriver = () => {
    Fire.database()
      .ref('driversAvailable/' + uid + '/')
      .remove();
  };

  const getUserData = () => {
    getData('user').then(res => {
      uid = res.uid;
    });
  };

  return (
    <View style={styles.page}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={region}>
        {latitude && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title="Lokasi"
            description="Lokasi"
          />
        )}
      </MapView>
      {user !== null && (
        <View style={styles.customerWrapper}>
          <User photo={photo} nama="User satu" role="081234567890" />
        </View>
      )}
      <View style={styles.button}>
        <Button title="Ambil Penumpang" />
      </View>
    </View>
  );
};

export default MapDriver;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentWrapper: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
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
});
