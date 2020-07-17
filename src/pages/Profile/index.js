import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, List, Gap, User} from '../../components';
import {DummyUser} from '../../assets';
import {colors, showError} from '../../utils';
import {Fire} from '../../config';

const Profile = ({navigation}) => {
  const [photo] = useState(DummyUser);
  const [fullName] = useState('User Satu');
  const [role] = useState('Driver');

  const onLogout = () => {
    Fire.auth()
      .signOut()
      .then(() => {
        navigation.replace('Started');
      })
      .catch(err => {
        showError(err.message);
      });
  };

  return (
    <View style={styles.page}>
      <View>
        <View style={styles.userWrapper}>
          <User photo={photo} nama={fullName} role={role} />
        </View>
        <Gap height={30} />
        <List
          type="next"
          name="Ubah Profil"
          icon="edit-profile"
          account
          onPress={() => navigation.navigate('EditProfile')}
        />
        <List
          type="next"
          name="Bantuan"
          icon="help"
          account
          onPress={() => navigation.navigate('Help')}
        />
        <List
          type="next"
          name="Keamanan"
          icon="privacy"
          account
          onPress={() => navigation.navigate('Secure')}
        />
      </View>
      <View>
        <View style={styles.buttonWrapper}>
          <Button type="secondary" title="Logout" onPress={onLogout} />
        </View>
        <View style={styles.border} />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    paddingTop: 40,
    flex: 1,
    justifyContent: 'space-between',
  },
  border: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  buttonWrapper: {
    paddingHorizontal: 40,
    marginBottom: 25,
  },
  userWrapper: {
    paddingHorizontal: 30,
  },
});
