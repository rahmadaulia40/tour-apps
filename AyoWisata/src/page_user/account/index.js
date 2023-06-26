import React, {useState, useEffect} from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ILNullPhoto } from '../../assets'
import {Button, Gap, Header, Input, List, Profile} from '../../components'
import { Firebase } from '../../config'
import { colors, fonts, getData, showError, showSuccess, storeData, useForm } from '../../utils'

const Account_user = ({navigation}) => {
    const [outlet, setOutlet] = useState([])
    const [profile, setProfile] = useState({
        fullName: '',
        profession: '',
        photo: ILNullPhoto
    })
    useEffect(() => {
        getData('user').then(res => {
            const data = res
            data.photo = res.photo == undefined ? ILNullPhoto : {uri : res.photo}
            setProfile(data)
        })
        getDataOutlet()
    }, [profile.uid])

    const getDataOutlet =()=>{
        Firebase.database().ref('outlet/').once('value')
        .then(res=>{
            setOutlet(res.val())
        })
    }

    const contactPerson =()=>{
        Linking.openURL('whatsapp://send?text=Hai, saya memiliki keluhan atas pelayanan anda !&phone=+62'+outlet.outletPhone)
        .catch(()=>{
            showError('Whatsapp tidak bisa di akses ! Pastikan Whatsapp sudah tersedia dan sudah aktif !')
        })
    }

    const signOut = () =>{
        Firebase.auth().signOut().then (() => {
            storeData('user', null)
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
        <>
        <View style={styles.page}>
            <Header title='Profile' type='dark-only'/>
            <View style={styles.coloring}>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 10}}>
                    <Gap height={10}/>
                    <Profile name={profile.fullName} desc={profile.email} photo={profile.photo == 'ILNullPhoto' ? ILNullPhoto : profile.photo}/>
                    <Gap height={14}/>
                    <List name='Edit Profile'  type='next-only' icon='edit-profile' onPress={()=> navigation.navigate('UpdateProfile_user')} />
                    <List name='Contact Person'  type='next-only' icon='help' onPress={contactPerson} />
                    <List name='Sign Out' type='next-only' icon='logout' onPress={signOut}/>
                    <Gap height ={80}/>
                </ScrollView>
            </View>
        </View>
        </>
    )
}

export default Account_user

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
