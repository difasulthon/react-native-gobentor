import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, List, Gap, User} from '../../components';
import {DummyUser} from '../../assets';
import {colors, showError, getData} from '../../utils';
import {Fire} from '../../config';

const Profile = ({navigation}) => {
  const [photo, setPhoto] = useState(DummyUser);
  const [fullName, setFullName] = useState('User Satu');
  const [role, setRole] = useState('Driver');
  const [profile, setProfile] = useState({
    uid: '',
    email: '',
    role: '',
    fullName: '',
    telp: '',
  });

  useEffect(() => {
    getData('user').then(res => {
      const data = res;
      setProfile(data);
      setRole(data.role);
    });
    getDataFromDB();
  }, [getDataFromDB]);

  const getDataFromDB = useCallback(() => {
    const data = profile;
    let useRole;
    if (data.role === 'driver') {
      useRole = 'Drivers';
    }
    if (data.role === 'customer') {
      useRole = 'Customers';
    }
    Fire.database()
      .ref('Users/' + useRole + '/' + profile.uid + '/')
      .once('value')
      .then(res => {
        if (res.val()) {
          const userData = res.val();
          setFullName(userData.name);
          setPhoto({uri: userData.profileImageUrl});
        }
      })
      .catch(err => {
        showError(err.message);
      });
  }, [profile]);

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
          icon="secure"
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
