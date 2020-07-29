import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, ScrollView, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {colors, showError, getData, storeData} from '../../utils';
import {Header, Gap, Input, Profile, Button} from '../../components';
import {DummyUser} from '../../assets';
import {Fire} from '../../config';

const EditProfile = ({navigation}) => {
  const [photo, setPhoto] = useState(DummyUser);
  const [photoForDB, setPhotoForDB] = useState(DummyUser);
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
          setPhoto({uri: userData.profileImageUrl});
          changeText('fullName', userData.name);
          changeText('telp', userData.phone);
        }
      })
      .catch(err => {
        showError(err.message);
      });
  }, [profile, changeText]);

  const getImage = () => {
    ImagePicker.launchImageLibrary(
      {quality: 0.5, maxWidth: 200, maxHeight: 200},
      response => {
        if (response.didCancel || response.error) {
          showError('Belum ada photo');
        } else {
          setPhotoForDB(`data:${response.type};base64, ${response.data}`);
          const source = {uri: response.uri};
          setPhoto(source);
        }
      },
    );
  };

  const changeText = useCallback(
    (key, value) => {
      setProfile({
        ...profile,
        [key]: value,
      });
    },
    [profile],
  );

  const update = () => {
    Alert.alert('Update Profile', 'Apakah anda yakin ?', [
      {
        text: 'Batal',
        onPress: () => {
          return;
        },
      },
      {
        text: 'Ya',
        onPress: () => {
          updateProfileData();
        },
      },
    ]);
  };

  const updateProfileData = () => {
    const data = profile;
    data.photo = photoForDB;
    const saveDB = {
      name: data.fullName,
      phone: data.telp,
      profileImageUrl: data.photo,
    };
    let role;
    if (data.role === 'driver') {
      role = 'Drivers';
    }
    if (data.role === 'customer') {
      role = 'Customers';
    }
    const updateRef = Fire.database().ref(
      'Users/' + role + '/' + profile.uid + '/',
    );
    updateRef
      .update(saveDB)
      .then(res => {
        navigation.goBack();
      })
      .catch(err => {
        showError(err.message);
      });
    data.photo = photo;
    storeData('user', data);
  };

  return (
    <View style={styles.page}>
      <Header title="Ubah Profil" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={16} />
          <Profile photo={photo} onPress={getImage} />
          <Gap height={16} />
          <Input label="Email" value={profile.email} disable />
          <Gap height={16} />
          <Input
            label="Full Name"
            value={profile.fullName}
            onChangeText={value => changeText('fullName', value)}
          />
          <Gap height={16} />
          <Input
            label="No. telepon"
            value={profile.telp}
            onChangeText={value => changeText('telp', value)}
            number
          />
          <Gap height={40} />
          <Button title="Simpan" onPress={update} />
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
