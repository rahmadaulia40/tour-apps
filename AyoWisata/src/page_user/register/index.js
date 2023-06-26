import React from 'react';
import {StyleSheet, View, ScrollView, Image, Text} from 'react-native';
import { Button, Gap, Input, Link } from '../../components';
import { colors, fonts, showError, storeData, useForm } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILLogo2 } from '../../assets';

const Register = ({navigation}) => {

  const [form, setForm] = useForm({
    fullName: '',
    storeName: '',
    storeAddress: '',
    ponsel: '',
    email: '',
    password: ''
  })

  const dispatch = useDispatch();

  const onContinue=()=>{
    dispatch({type : 'SET_LOADING', value : true})
    Firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
      .then((success) => {
        dispatch({type : 'SET_LOADING', value : false})
        setForm('reset')

        const data_user ={
          fullName : form.fullName,
          storeName: form.storeName,
          storeAddress: form.storeAddress,
          ponsel : form.ponsel,
          email: form.email,
          uid : success.user.uid,
          next_form : 'Splash',
          levelAccount : 'user'
        }
        Firebase.database()
        .ref('account/'+success.user.uid+'/')
        .set(data_user)
        //save to localstorage
        storeData('user',data_user)
        
        navigation.navigate('uploadPhoto_user', data_user)
      })
      .catch((err) => {
        dispatch({type : 'SET_LOADING', value : false})
        showError(err.message)
      });
  }

  return (
    <View  style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.image}>
          <Gap height={20}/>
          <Image source={ILLogo2} style={styles.logo}/>
          <Text style={styles.title}>Register</Text>
        </View>
          <Gap height={20}/>
          <Input judul='Nama Lengkap' value={form.fullName} onChangeText={(value)=> setForm('fullName',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='Nama Toko' value={form.storeName} onChangeText={(value)=> setForm('storeName',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='Alamat Toko' value={form.storeAddress} onChangeText={(value)=> setForm('storeAddress',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='No. Ponsel' keyboardType='phone-pad' value={form.ownerPhone} onChangeText={(value)=> setForm('ponsel',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='Email' keyboardType='email-address' value={form.email} onChangeText={(value)=> setForm('email',value)} type='komentar'/>
          <Gap height={20}/>
          <Input judul='New Password' secureTextEntry value={form.password} onChangeText={ (value)=> setForm('password',value)} type='komentar'/>
          <Gap height={30}/>
          <Button title='Register' onPress={onContinue}/>
          <Gap height={20}/>
          <Link title='Sudah punya akun? Klik Disini' size={16} align='center' onPress={()=> navigation.goBack()}/>
          <Gap height={30}/>
        </ScrollView>
  </View>

  )
}

export default Register

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: colors.background
  },
  image: {
    aspectRatio: 1 * 1.8
  },
  logo: {
    resizeMode: 'cover',
    height: '80%',
    width: '60%',
    alignSelf: 'center'
    
  },
  title: {
    textAlign: 'center',
      color : colors.text.primary,
      fontSize : 18,
      fontFamily : fonts.primary[800]
  }
})