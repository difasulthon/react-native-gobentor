import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ILRickshawLogin} from '../../assets';
import {Input, Button, Gap} from '../../components';
import {colors, fonts} from '../../utils';

const LoginCustomer = ({navigation}) => {
  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={40} />
        <ILRickshawLogin />
        <Gap height={40} />
        <Text style={styles.title}>Selamat datang, silahkan masuk</Text>
        <Gap height={40} />
        <Input label={'Email'} />
        <Gap height={16} />
        <Input label={'Password'} />
        <Gap height={40} />
        <Button
          title={'Masuk'}
          onPress={() => navigation.navigate('MainAppCustomer')}
        />
        <Gap height={16} />
        <Button
          title={'Daftar'}
          onPress={() => navigation.navigate('MainAppCustomer')}
        />
      </ScrollView>
    </View>
  );
};

export default LoginCustomer;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    maxWidth: 135,
  },
});
