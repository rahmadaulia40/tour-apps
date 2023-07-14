import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { Images, Styles } from '../../../Utils'
import { Gap } from '../../Atom'

const BoxImage = ({title, desc, image, onPress, jarak}) => {
  return (
    <TouchableOpacity onPress={onPress}>
    <ImageBackground source={Images(image)} style={Styles.boxWisata} imageStyle={{borderRadius: 10, opacity: 0.6}}>
        <View>
            <Text style={Styles.title}>{title}</Text>
            <Text style={Styles.Desc}>{desc}</Text>
        </View>
        <Text style={Styles.Desc}>{jarak}</Text>
    </ImageBackground>
    <Gap height={10}/>
    </TouchableOpacity>
  )
}

export default BoxImage