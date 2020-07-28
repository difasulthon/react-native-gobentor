import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {ILEmptyHistory} from '../../assets';
import {List} from '../../components';
import {colors, fonts, getData, showError} from '../../utils';
import {Fire} from '../../config';

let listIdHistory = [];

const History = ({navigation}) => {
  const [data] = useState([
    {
      name: 'satu',
      desc: '14 Juli 2020',
    },
    {
      name: 'dua',
      desc: '14 Juli 2020',
    },
    {
      name: 'tiga',
      desc: '14 Juli 2020',
    },
  ]);
  const [userRole, setUserRole] = useState(null);
  const [uid, setUid] = useState(null);
  const [listHistory, setListHistory] = useState([]);

  useEffect(() => {
    getData('user').then(res => {
      if (res.role === 'driver') {
        setUserRole('Drivers');
      }
      if (res.role === 'customer') {
        setUserRole('Customers');
      }
      setUid(res.uid);
    });
    getHistoryData();
  }, [getHistoryData]);

  const getHistoryData = useCallback(() => {
    const userHistoryDatabase = Fire.database().ref(
      'Users/' + userRole + '/' + uid + '/history/',
    );
    userHistoryDatabase
      .once('value')
      .then(res => {
        if (res.val()) {
          res.forEach(value => {
            fetchRideInformation(value.key);
          });
        }
      })
      .catch(err => {
        showError(err.message);
      });
  }, [userRole, uid, fetchRideInformation]);

  const fetchRideInformation = useCallback(rideKey => {
    const historyDatabase = Fire.database().ref('history/' + rideKey + '/');
    historyDatabase
      .once('value')
      .then(res => {
        if (res.val()) {
          const rideId = res.key;
          const itemHistory = {
            rideId: rideId,
            timestamp: res.val().timestamp,
          };
          listIdHistory.push(itemHistory);
          console.log(listIdHistory);
          setHistoryData(listIdHistory);
        }
      })
      .catch(err => {
        showError(err.message);
      });
  }, []);

  const setHistoryData = arrayData => {
    setListHistory(arrayData);
  };

  return (
    <View style={styles.page}>
      <View>
        <Text style={styles.title}>Riwayat</Text>
        {listHistory.length === 0 ? (
          <View style={styles.contentEmpty}>
            <ILEmptyHistory />
            <Text style={styles.textEmpty}>Belum ada perjalanan</Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listHistory}
            keyExtractor={item => item.id}
            renderItem={item => (
              <List
                name={item.item.timestamp}
                desc={item.item.rideId}
                type="next"
                onPress={() => navigation.navigate('DetailHistory')}
              />
            )}
          />
        )}
      </View>
      <View style={styles.border} />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.primary[700],
    color: colors.text.primary,
    paddingTop: 40,
    paddingLeft: 40,
    paddingBottom: 14,
  },
  contentEmpty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  imageEmpty: {
    height: 150,
    width: 280,
  },
  textEmpty: {
    paddingTop: 10,
    fontFamily: fonts.primary[700],
    fontSize: 14,
    color: colors.primary,
  },
  border: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
});
