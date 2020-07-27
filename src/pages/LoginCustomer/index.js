import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ILRickshawLogin} from '../../assets';
import {Input, Button, Gap} from '../../components';
import {colors, fonts, useForm, showError, storeData} from '../../utils';
import {Fire} from '../../config';

const LoginCustomer = ({navigation}) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });
  const [userId, setUserId] = useState();

  useEffect(() => {
    Fire.auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('MainAppCustomer');
      } else {
        return;
      }
    });
  }, [navigation]);

  const onRegist = () => {
    Fire.auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(success => {
        setForm('reset');
        setUserId(success.user.uid);
        const data = {
          email: form.email,
          uid: userId,
          role: 'customer',
        };
        Fire.database()
          .ref('Users/Customers/' + userId + '/')
          .set(true);
        storeData('user', data);
      })
      .catch(error => {
        const errorMessage = error.message;
        showError(errorMessage);
      });
  };

  const onLogin = () => {
    Fire.auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then(res => {
        setForm('reset');
        const data = {
          email: form.email,
          uid: res.user.uid,
          role: 'customer',
        };
        storeData('user', data);
      })
      .catch(error => {
        showError(error.message);
      });
  };

  return (
    <View style={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Gap height={40} />
        <ILRickshawLogin />
        <Gap height={40} />
        <Text style={styles.title}>Selamat datang, silahkan masuk</Text>
        <Gap height={40} />
        <Input
          label={'Email'}
          value={form.email}
          onChangeText={text => setForm('email', text)}
        />
        <Gap height={16} />
        <Input
          label={'Password'}
          value={form.password}
          onChangeText={text => setForm('password', text)}
        />
        <Gap height={40} />
        <Button title={'Masuk'} onPress={onLogin} />
        <Gap height={16} />
        <Button title={'Daftar'} onPress={onRegist} />
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
