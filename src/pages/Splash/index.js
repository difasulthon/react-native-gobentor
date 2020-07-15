import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../utils';
import {ILLogoSplash} from '../../assets';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Started');
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.page}>
      <ILLogoSplash />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
