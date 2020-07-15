import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Button, User} from '../../components';
import {colors} from '../../utils';
import {DummyUser} from '../../assets';

const HomeCustomer = ({navigation}) => {
  const [region, setRegion] = useState();
  const [photo] = useState(DummyUser);
  // const [user] = useState({
  //   photo: DummyUser,
  //   nama: 'User satu',
  //   role: '081234567890',
  // });
  const [user] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iPhone: ' + response);

      if (response === 'granted') {
        locateCurrentLocation();
      }
    } else {
      let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Android: ' + response);

      if (response === 'granted') {
        locateCurrentLocation();
      }
    }
  }, []);

  const locateCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(JSON.stringify(position));

        let getPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };

        setRegion(getPosition);
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000},
    );
  };

  return (
    <View style={styles.page}>
      <View>
        {/* <GooglePlacesAutocomplete
          placeholder="Enter Location"
          minLength={2}
          autoFocus={false}
          fetchDetails
          listViewDisplayed="auto"
          query={{
            key: ',
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
        /> */}
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={region}>
          {/* <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title="Lokasi"
            description="Lokasi"
          /> */}
        </MapView>
        {user !== null && (
          <View style={styles.customerWrapper}>
            <User photo={photo} nama="User satu" role="081234567890" />
          </View>
        )}

        <View style={styles.button}>
          <Button
            title="Mulai Pesan Bentor"
            onPress={() => navigation.navigate('MapDriver')}
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
  contentWrapper: {
    flex: 1,
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
