import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Gap, Button} from '../../atoms';
import {colors, fonts} from '../../../utils/';

const Header = ({title, onPress, type, desc, photo}) => {
  return (
    <View style={styles.container(type)}>
      <Button type="icon-only" icon={'back-light'} onPress={onPress} />
      <Text style={styles.text(type)}>{title}</Text>
      <Gap width={24} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: type => ({
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.header,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  text: type => ({
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.white,
    textTransform: 'capitalize',
  }),
});
