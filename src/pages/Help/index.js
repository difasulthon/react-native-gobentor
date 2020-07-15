import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Header, Gap} from '../../components';
import {colors, fonts} from '../../utils';

const Help = ({navigation}) => {
  return (
    <View style={styles.page}>
      <Header title="Bantuan" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.paragraphText}>Halo sobat,</Text>
          <Gap height={10} />
          <Text style={styles.paragraphText}>
            Selamat datang di aplikasi Go Bentor. Go Bentor adalah aplikasi yang
            bisa digunakan untuk bisa memesan becak motor dan diantar oleh
            pengemudi becak motor sampai tujuan. Bagi pengemudi juga dapat
            menggunakan aplikasi ini untuk menerima pesanan para penumpang.
            Untuk bisa menggunakan fitur - fitur pada aplikasi ini silahkan
            ikuti panduan berikut ini.
          </Text>
          <Gap height={10} />
          <Text style={styles.paragraphText}>
            1. Pengguna harus mendaftarkan akun email.
          </Text>
          <Text style={styles.paragraphText}>
            2. Pengguna perlu memilih role sebagai pembeli atau pangkalan.
          </Text>
          <Text style={styles.paragraphText}>
            3. Setiap satu akun email hanya bisa digunakan untuk satu role.
          </Text>
          <Gap height={10} />
          <Text style={styles.paragraphText}>
            Jika anda memilih role penumpang, ikuti panduan berikut ini untuk
            bisa memesan becak motor.
          </Text>
          <Gap height={10} />
          <Text style={styles.paragraphText}>
            1. Cari lokasi tujuan pada kolom search.
          </Text>
          <Text style={styles.paragraphText}>
            2. Klik lokasi yang diinginkan.
          </Text>
          <Text style={styles.paragraphText}>
            3. Klik tombol panggil bentor.
          </Text>
          <Text style={styles.paragraphText}>
            4. Tunggu pengemudi bentor sampai tempat anda.
          </Text>
          <Text style={styles.paragraphText}>
            5. Nikmati perjalanan dan bayar sesuai aplikasi.
          </Text>
          <Gap height={10} />
          <Text style={styles.paragraphText}>
            Jika anda memilih role pengemudi, ikuti panduan berikut ini untuk
            bisa menerima pesanan dan mengantar sampai tujuan.
          </Text>
          <Gap height={10} />
          <Text style={styles.paragraphText}>1. Aktifkan lokasi anda.</Text>
          <Text style={styles.paragraphText}>
            2. Jika sudah muncul lokasi penumpang, klik ambil penumpang.
          </Text>
          <Text style={styles.paragraphText}>3. Jemput penumpang anda.</Text>
          <Text style={styles.paragraphText}>
            4. Antarkan sampai tempat tujuan
          </Text>
          <Text style={styles.paragraphText}>5. Terima bayaran anda.</Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  paragraphText: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'justify',
  },
});
