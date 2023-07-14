import React, { useEffect } from 'react';
import {Image, View, Text, ImageBackground, StatusBar, PermissionsAndroid} from 'react-native';
import { Styles } from '../../Utils';
import { Image_GetStarted, Image_Logo } from '../../Assets';
import Geolocation from 'react-native-geolocation-service';

const Splash = ({navigation}) => {
  useEffect(()=>{
    requestAccessLocation()
  },[])

  
  const requestAccessLocation = async () => {
    try {
      const cekPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          
            title: 'Izin akses lokasi',
            message: 'Anda belum memberikan akses lokasi pada aplikasi ini !',
            buttonPositive: 'OK',
        }
      )
      if(cekPermission == PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            const coordinate = {
              latitudeUser : position.coords.latitude,
              longitudeUser: position.coords.longitude
            }
            setTimeout(()=>{
              navigation.replace('Home', coordinate)
            },6000)
          },
          () => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 300, distanceFilter: 10, forceRequestLocation : true }
        );
      }
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <StatusBar hidden={true}/>
      <ImageBackground source={Image_GetStarted} style={Styles.page}>
        <View style={Styles.pageSplash}>
          <View style={Styles.imageSplash}>
            <Image source={Image_Logo} style={Styles.logoSplash}/>
          </View>
          <Text style={Styles.titleSplash}>Versi : 1.0.0</Text>
        </View>
      </ImageBackground>
    </>
  )
}

export default Splash