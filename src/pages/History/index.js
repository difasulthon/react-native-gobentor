import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {ILEmptyHistory} from '../../assets';
import {List} from '../../components';
import {colors, fonts} from '../../utils';

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

  return (
    <View style={styles.page}>
      <View>
        <Text style={styles.title}>Riwayat</Text>
        {data.length === 0 ? (
          <View style={styles.contentEmpty}>
            <ILEmptyHistory />
            <Text style={styles.textEmpty}>Belum ada perjalanan</Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={item => item.id}
            renderItem={item => (
              <List
                name={item.item.name}
                desc={item.item.desc}
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
