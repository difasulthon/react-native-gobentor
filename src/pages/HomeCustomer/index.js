import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {Button} from '../../components';
import {colors} from '../../utils';

const HomeCustomer = ({navigation}) => {
  const [region, setRegion] = useState();

  useEffect(() => {
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
      },
      error => {},
      {enableHighAccuracy: true},
    );
  };

  return (
    <View style={styles.page}>
      <View>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={region}
        />

        <View style={styles.button}>
          <Button
            title="Mulai Pesan Bentor"
            onPress={() => navigation.navigate('MapCustomer')}
          />
        </View>
      </View>
      <View style={styles.border} />
    </View>
  );
};

export default HomeCustomer;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  button: {
    paddingHorizontal: 30,
    paddingTop: 10,
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
    paddingVertical: 10,
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
