import React, {useState, useEffect} from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Gap, Header, Input, Profile } from '../../components'
import { colors, fonts, getData, showError, showSuccess, storeData } from '../../utils'
import {Firebase} from '../../config'
import {launchImageLibrary} from 'react-native-image-picker'
import { ILNullPhoto } from '../../assets'
const UpdateProfile_admin = ({navigation}) => {
    const [profile, setProfile] = useState({
        fullName: '',
        ponsel: '',
        email: '',
    })
    const [password, setPassword] = useState('')
    const [photoForDB, setPhotoForDB] = useState('')
    const [photo, setPhoto] = useState(ILNullPhoto)

    useEffect(() => {
        getData('administrator').then(res => {
            setPhoto(res.photo == undefined ? ILNullPhoto : {uri : res.photo})
            setProfile(res)
        })
    }, [])

    const update =()=>{
        if(password.length > 0 ) {
            if(password.length < 6 ) {
                showError('Password kurang dari 6 karakter')
            }
            else 
            {
                updatePassword()
                updateProfileData()
                navigation.reset({
                    index: 0,
                    routes: [{name: 'MainApp_administrator'}]
                })
                showSuccess('Sukses Mengubah Data')
            }
        }
        else 
        {
            updateProfileData()
            navigation.reset({
                    index: 0,
                    routes: [{name: 'MainApp_administrator'}]
                })
            showSuccess('Sukses Mengubah Data')
        }
    }

    const updatePassword =()=> {
        Firebase.auth().onAuthStateChanged(user => {
            if(user) {
                user.updatePassword(password)
                .catch(err => {
                    showError(err.message)
                })
            }
        })
    }

    const updateProfileData =()=>{
        const data = profile
        data.photo = photoForDB.length == 0 ? photo.uri : photoForDB
        Firebase.database().ref(`account/${profile.uid}/`).update(data)
        .then(() => {
            storeData('administrator', data)
        })
        .catch(err => {
            showError(err.message)
        })
    }

    const changeText = (key, value) => {
        setProfile({
            ...profile,
            [key]: value
        })
    }

    const getImage = () => {
        launchImageLibrary({quality: 0.5, maxWidth: 200, maxHeight: 200, includeBase64: true, mediaType: 'photo', selectionLimit: 0}, response => {
          if(response.didCancel || response.error)
          {
            showError('Oops, sepertinya anda tidak memilih fotonya?')
          }
          else 
          {
            response.assets.map( data => {
              const source = {uri : data.uri}
              setPhotoForDB(`data:${data.type};base64, ${data.base64}`)
              setPhoto(source)
            })
          }
        })
      }

    return (
        <View style={styles.page}>
        <Header title='Edit Profile' type='payment' onPress={()=> navigation.goBack()}/>
        <View style={styles.coloring}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Gap height={20} />
                <View style={styles.content}>
                    <Profile photo={photo} isRemove onPress={getImage}/>
                    <Gap height={26} />
                    <Input judul='Full Name' type ='komentar' value={profile.fullName} onChangeText={(value) => changeText('fullName', value)}/>
                    <Gap height={24}/>
                    <Input judul='Nomor Ponsel' keyboardType='numeric' type ='komentar' value={profile.ponsel} onChangeText={(value) => changeText('ponsel', value)}/>
                    <Gap height={24}/>
                    <Input judul='Email' type ='komentar' value={profile.email} disable/>
                    <Gap height={24}/>
                    <Input judul='Password' type ='komentar' secureTextEntry value={password} onChangeText={value => {setPassword(value)}}/>
                    <Text style={styles.info}>* Kosongkan jika tidak ingin diubah !</Text>
                    <Gap height={40}/>
                    <Button title='Save Profile' onPress={update}/>
                </View>
            </ScrollView>
        </View>
        </View>
    )
}

export default UpdateProfile_admin

const styles = StyleSheet.create({
    page : {
        flex : 1,
        backgroundColor : colors.primary,
      },
      coloring:{
        backgroundColor : colors.background,
        flex : 1,
      },
    content :{
        padding: 40,
        paddingTop: 0
    },
    info: {
        fontFamily: fonts.primary[600],
        color : colors.error
      }
})
