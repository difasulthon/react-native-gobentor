import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import numeral from 'numeral';
import {decode} from '@mapbox/polyline';
import {colors, showError, getData} from '../../utils';
import {Header, Profile, Gap, Input} from '../../components';
import {DummyUser} from '../../assets';
import {Fire} from '../../config';

let idUser;
let roles;

const getDirections = async (startLoc, destinationLoc) => {
  try {
    const KEY = '';
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`,
    );
    let respJson = await resp.json();
    let points = decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    return coords;
  } catch (error) {
    return error;
  }
};

const DetailHistory = ({navigation, route}) => {
  const rideId = route.params;

  const [roleUser, setroleUser] = useState(null);
  const [photo, setPhoto] = useState(DummyUser);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [location, setLocation] = useState();
  const [distance, setDistance] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState();
  const [fromLat, setFromLat] = useState(1);
  const [fromLng, setFromLng] = useState(1);
  const [toLat, setToLat] = useState(1);
  const [toLng, setToLng] = useState(1);
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    getData('user').then(res => {
      if (res.role === 'driver') {
        setroleUser('customer');
      }
      if (res.role === 'customer') {
        setroleUser('driver');
      }
    });
    getDataHisitory();
    getRoute();
  }, [getDataHisitory, getRoute]);

  const getDataHisitory = useCallback(() => {
    const dataHistory = Fire.database().ref('history/' + rideId + '/');
    dataHistory
      .once('value')
      .then(res => {
        if (res.val()) {
          const data = res.val();
          setLocation(data.destination);
          setDistance(data.distance);
          setPrice(data.price);
          setDate(data.timestamp);
          setFromLat(data.location.from.lat);
          setFromLng(data.location.from.lng);
          setToLat(data.location.to.lat);
          setToLng(data.location.to.lng);
          if (roleUser === 'customer') {
            idUser = data.customer;
            roles = 'Customers';
          }
          if (roleUser === 'driver') {
            idUser = data.driver;
            roles = 'Drivers';
          }
          getDataUser(idUser, roles);
        }
      })
      .catch(err => {
        showError(err.message);
      });
  }, [rideId, roleUser]);

  const getDataUser = (idUserData, rolesData) => {
    const dataUser = Fire.database().ref(
      'Users/' + rolesData + '/' + idUserData + '/',
    );
    dataUser
      .once('value')
      .then(res => {
        if (res.val()) {
          const data = res.val();
          setName(data.name);
          setPhone(data.phone);
          setPhoto({uri: data.profileImageUrl});
        }
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const getRoute = useCallback(() => {
    getDirections(`${fromLat},${fromLng}`, `${toLat},${toLng}`)
      .then(coordsValue => {
        setCoords(coordsValue);
      })
      .catch(err => {
        showError(err);
      });
  }, [fromLat, fromLng, toLat, toLng]);

  const RupiahFormat = Price => {
    return numeral(Price)
      .format('0,0')
      .replace(/,/g, '.');
  };

  return (
    <View style={styles.page}>
      <Header title="Detail Riwayat" onPress={() => navigation.goBack()} />
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={{
          latitude: -6.2233561,
          longitude: 107.071152,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        }}>
        {fromLat && (
          <Marker
            coordinate={{
              latitude: fromLat,
              longitude: fromLng,
            }}
            title="Pickup"
            description="Pickup"
          />
        )}
        {toLat && (
          <Marker
            coordinate={{
              latitude: toLat,
              longitude: toLng,
            }}
            title="Destination"
            description={location}
          />
        )}
        {coords.length > 0 && (
          <Polyline coordinates={coords} strokeWidth={4} strokeColor={'red'} />
        )}
      </MapView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <Gap height={10} />
          <Profile photo={photo} detail />
          <Gap height={16} />
          <Input label="Nama" value={name} disable />
          <Gap height={16} />
          <Input label="Telepon" value={phone} disable />
          <Gap height={16} />
          <Input label="Lokasi" value={location} disable />
          <Gap height={16} />
          <Input label="Jarak" value={`${distance} Km`} disable />
          <Gap height={16} />
          <Input label="Harga" value={`Rp ${RupiahFormat(price)}`} disable />
          <Gap height={16} />
          <Input label="Tanggal" value={date} disable />
          <Gap height={10} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailHistory;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    width: '100%',
    height: '25%',
  },
  contentWrapper: {
    paddingHorizontal: 30,
  },
});
