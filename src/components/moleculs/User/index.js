import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {fonts, colors} from '../../../utils';

const User = ({photo, nama, role}) => {
  return (
    <View style={styles.userWrapper}>
      <Image source={photo} style={styles.photo} />
      <View style={styles.nameWrapper}>
        <Text style={styles.nama}>{nama}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  userWrapper: {
    flexDirection: 'row',
  },
  nameWrapper: {
    justifyContent: 'center',
    marginLeft: 16,
  },
  photo: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
  },
  nama: {
    fontFamily: fonts.primary[700],
    color: colors.text.primary,
    fontSize: 14,
  },
  role: {
    fontFamily: fonts.primary[400],
    color: colors.text.primary,
    fontSize: 14,
  },
});
