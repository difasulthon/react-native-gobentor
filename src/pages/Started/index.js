import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors, fonts} from '../../utils';
import {ILLogoStarted, ILDriver, ILCustomer} from '../../assets';
import {Gap} from '../../components';

const Started = ({navigation}) => {
  return (
    <View style={styles.page}>
      <Gap height={30} />
      <ILLogoStarted />
      <Gap height={40} />
      <Text style={styles.title}>Tentukan pilihan anda</Text>
      <Gap height={60} />
      <View style={styles.contentWrapper}>
        <View style={styles.viewWrapper}>
          <TouchableOpacity onPress={() => navigation.replace('LoginDriver')}>
            <ILDriver />
            <Text style={styles.contentText}>PENGEMUDI</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewWrapper}>
          <TouchableOpacity onPress={() => navigation.replace('LoginCustomer')}>
            <ILCustomer />
            <Text style={styles.contentText}>PENUMPANG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Started;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.text.startedTitle,
  },
  contentWrapper: {
    flexDirection: 'row',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    fontFamily: fonts.primary[800],
    color: colors.text.primary,
    textAlign: 'center',
  },
});
