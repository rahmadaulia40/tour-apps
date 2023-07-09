import React, { useEffect } from 'react';
import {Image, View, Text, ImageBackground, StatusBar} from 'react-native';
import { Styles } from '../../Utils';
import { Image_GetStarted, Image_Logo } from '../../Assets';

const Splash = ({navigation}) => {
  useEffect(()=>{
    setTimeout(()=>{
        navigation.replace('Home')
    },6000)
  },[])

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