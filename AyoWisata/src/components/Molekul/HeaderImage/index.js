import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import { Gap } from '../../Atom'
import { Styles } from '../../../Utils'

const HeaderImage = ({imageBackground, logo, header}) => {
  return (
    <ImageBackground source={imageBackground} imageStyle={Styles.imageGetStartedBox}>
        <Gap height={25}/>
        <View style={Styles.image}>
            <Image source={logo} style={Styles.logo}/>
        </View>
        <Text style={Styles.header}>{header}</Text>  
    </ImageBackground>
  )
}

export default HeaderImage