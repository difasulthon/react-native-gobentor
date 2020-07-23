import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {Button, User} from '../../components';
import {colors, getData, showError, fonts} from '../../utils';
import {DummyUser} from '../../assets';
import {Fire} from '../../config';

let uid;
let status = 0;
let customerId;
let pickupLat = 1;
let pickupLng = 1;
let destName = 'destination';
let destLat = 1;
let destLng = 1;

const MapDriver = ({navigation}) => {
  const [region, setRegion] = useState();
  const [photo] = useState(DummyUser);
  const [latitude, setLatitude] = useState(1);
  const [longitude, setLongitude] = useState(1);
  const [user, setUser] = useState(null);
  const [textButton, setTextButton] = useState('Ambil Penumpang');

  useEffect(() => {
    getUserData();

    const fetchLocation = setInterval(() => {
      requestLocationPermission();
    }, 1000);

    getAssignedCustomer();

    return () => {
      clearInterval(fetchLocation);
      // disconnectDriver();
    };
  }, [requestLocationPermission, navigation, getAssignedCustomer]);

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
  }, [locateCurrentLocation]);

  const locateCurrentLocation = useCallback(() => {
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

        setDriverAvailable(getPosition.latitude, getPosition.longitude);
      },
      error => {},
      {enableHighAccuracy: true},
    );
  }, []);

  const setDriverAvailable = (latitudeData, longitudeData) => {
    const location = {
      id: uid,
      latitude: latitudeData,
      longitude: longitudeData,
    };
    const refAvailable = Fire.database().ref('driversAvailable/' + uid + '/');
    refAvailable.set(location);
  };

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

  const onRide = () => {
    switch (status) {
      case 1:
        status = 2;
        setTextButton('Perjalanan Selesai');
        break;
      case 2:
        endRide();
        break;
    }
  };

  const getAssignedCustomer = useCallback(() => {
    const assignedCustomerRef = Fire.database().ref(
      'Users/Drivers/' + uid + '/customerRequest/customerRideId/',
    );
    assignedCustomerRef
      .once('value')
      .then(res => {
        if (res.val()) {
          customerId = res.val();
          status = 1;
          getAssignedCustomerPickupLocation(customerId);
          getAssignedCustomerDestination();
          getAssignedCustomerInfo();
        }
      })
      .catch(err => {
        showError(err.message);
      });
  }, []);

  const getAssignedCustomerPickupLocation = customerIdData => {
    const customerRef = Fire.database().ref(
      'customerRequest/' + customerIdData + '/',
    );
    customerRef
      .once('value')
      .then(res => {
        if (res.val()) {
          const data = res.val();
          pickupLat = data.latitude;
          pickupLng = data.longitude;
        }
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const getAssignedCustomerDestination = () => {
    const customerRef = Fire.database().ref(
      'Users/Drivers/' + uid + '/customerRequest/',
    );
    customerRef
      .once('value')
      .then(res => {
        if (res.val()) {
          const data = res.val();
          destName = data.destination;
          destLat = data.destinationLat;
          destLng = data.destinationLng;
        }
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const getAssignedCustomerInfo = () => {
    const customerRef = Fire.database().ref('Users/Customers/' + customerId);
    customerRef
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
    setTextButton('Ambil Penumpang');
    const driverRef = Fire.database().ref(
      'Users/Drivers/' + uid + '/customerRequest/',
    );
    driverRef.set(false);
    Fire.database()
      .ref('customerRequest/' + uid + '/')
      .remove();
    status = 0;
    customerId = '';
    pickupLat = 1;
    pickupLng = 1;
    destName = 'destination';
    destLat = 1;
    destLng = 1;
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
        {pickupLat && (
          <Marker
            coordinate={{
              latitude: pickupLat,
              longitude: pickupLng,
            }}
            title="Pickup"
            description="Pickup"
          />
        )}
        {destLat && (
          <Marker
            coordinate={{
              latitude: destLat,
              longitude: destLng,
            }}
            title="Destination"
            description={destName}
          />
        )}
      </MapView>
      {user !== null && (
        <View style={styles.customerWrapper}>
          <User photo={photo} nama="User satu" role="081234567890" />
          <Text style={styles.textPrice}>Rp 5000</Text>
        </View>
      )}
      <View style={styles.button}>
        <Button title={textButton} onPress={onRide} />
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
  textPrice: {
    fontFamily: fonts.primary[700],
    color: colors.text.primary,
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 30,
  },
});
