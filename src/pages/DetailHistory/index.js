import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {colors} from '../../utils';
import {Header, Profile, Gap, Input} from '../../components';
import {DummyUser} from '../../assets';

const DetailHistory = ({navigation}) => {
  const [photo] = useState(DummyUser);

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
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <Gap height={10} />
          <Profile photo={photo} detail />
          <Gap height={16} />
          <Input label="Nama" value={'Driver Satu'} disable />
          <Gap height={16} />
          <Input label="Telepon" value={'081234567890'} disable />
          <Gap height={16} />
          <Input label="Lokasi" value={'Lapangan Sepak Bola'} disable />
          <Gap height={16} />
          <Input label="Jarak" value={'2.5 km'} disable />
          <Gap height={16} />
          <Input label="Harga" value={'Rp 7.200'} disable />
          <Gap height={16} />
          <Input label="Tanggal" value={'15 Juli 2020'} disable />
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
