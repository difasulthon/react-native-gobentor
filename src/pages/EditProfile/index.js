import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {colors, useForm} from '../../utils';
import {Header, Gap, Input, Profile, Button} from '../../components';
import {DummyUser} from '../../assets';

const EditProfile = ({navigation}) => {
  const [photo] = useState(DummyUser);
  const [form, setForm] = useForm({
    userId: 1,
    fullName: 'User Satu',
    role: 'Driver',
    email: 'usersatu@email.com',
    password: '',
  });

  return (
    <View style={styles.page}>
      <Header title="Ubah Profil" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={16} />
          <Profile photo={photo} />
          <Gap height={16} />
          <Input
            label="Full Name"
            value={form.fullName}
            onChangeText={value => setForm('fullName', value)}
          />
          <Gap height={16} />
          <Input label="Email" value={form.email} disable />
          <Gap height={16} />
          <Input
            label="Password"
            value={form.password}
            onChangeText={value => setForm('password', value)}
            secureTextEntry
          />
          <Gap height={40} />
          <Button title="Simpan" />
        </ScrollView>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 40,
  },
});
