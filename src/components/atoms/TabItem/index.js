import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  IconHome,
  IconHomeInactive,
  IconHistory,
  IconHistoryInactive,
  IconProfile,
  IconProfileInactive,
} from '../../../assets';
import {colors, fonts} from '../../../utils';

const TabItem = ({title, active, onPress, onLongPress}) => {
  const Icon = () => {
    if (title === 'Home') {
      return active ? <IconHome /> : <IconHomeInactive />;
    }
    if (title === 'Riwayat') {
      return active ? <IconHistory /> : <IconHistoryInactive />;
    }
    if (title === 'Profil') {
      return active ? <IconProfile /> : <IconProfileInactive />;
    }
    return <IconHomeInactive />;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}>
      <Icon />
      <Text style={styles.text(active)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: active => ({
    fontSize: 10,
    color: active ? colors.text.menuActive : colors.text.menuInactive,
    fontFamily: fonts.primary[600],
    marginTop: 4,
  }),
});
