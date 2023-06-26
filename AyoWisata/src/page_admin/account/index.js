import React, {useState, useEffect} from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ILNullPhoto } from '../../assets'
import {Gap, Header, List, Profile} from '../../components'
import { Firebase } from '../../config'
import { colors, getData, showError, showSuccess, storeData } from '../../utils'

const Account_admin = ({navigation}) => {
    const [profile, setProfile] = useState({
        fullName: '',
        profession: '',
        photo: ILNullPhoto
    })
    useEffect(() => {
        //mengambil data dari localstorage
        getData('administrator').then(res => {
            const data = res
            data.photo = res.photo == undefined ? ILNullPhoto : {uri : res.photo}
            setProfile(data)
        })
    }, [])

    const signOut = () =>{
        Firebase.auth().signOut().then (() => {
            storeData('administrator', null)
            navigation.reset({
                index: 0,
                routes: [{name: 'Login'}]
            })
        })
        .then(()=> {
            showSuccess('Anda telah SignOut !')
        })
        .catch(err => {
            showError(err.message)
        })
    }

    return (
        <View style={styles.page}>
            <Header title='Akun' type='dark-only'/>
            <View style={styles.coloring}>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 10}}>
                    <Gap height={10}/>
                    <Profile name={profile.fullName} desc={profile.email} photo={profile.photo}/>
                    <Gap height={14}/>
                    <List name='Update Profile' type='next-only' icon='edit-profile' onPress={()=> navigation.navigate('UpdateProfile_admin')} />
                    <List name='Update Toko' type='next-only' icon='store' onPress={()=> navigation.navigate('Update_toko')}/>
                    <List name='Data Barang' type='next-only' icon='box' onPress={()=> navigation.navigate('Data_Barang')}/>
                    <List name='Data DSPayLater' type='next-only' icon='price' onPress={()=> navigation.navigate('Data_DSPayLater')}/>
                    <List name='Data Karyawan' type='next-only' icon='admin' onPress={()=> navigation.navigate('List_admin')}/>
                    <List name='Sign Out' type='next-only' icon='logout' onPress={signOut}/>
                    <Gap height ={80}/>
                </ScrollView>
            </View>
        </View>
    )
}

export default Account_admin

const styles = StyleSheet.create({
    page : {
        flex : 1,
        backgroundColor : colors.primary,
      },
      coloring:{
        backgroundColor : colors.secondary,
        flex : 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 20,
        borderTopWidth: 5,
        borderColor: colors.border.onBlur
      },
})
