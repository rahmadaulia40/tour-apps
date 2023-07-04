import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { Styles } from '../../../Utils'
import { Gap } from '../../Atom'
import { KA_1, MABAR_1, PAS_1, SUNGLO_1 } from '../../../Assets'

const BoxImage = ({title, desc, image}) => {
    const images =()=>{
        if(image == 'KA_1'){
            return KA_1
        }
        if(image == 'MABAR_1'){
            return MABAR_1
        }
        if(image == 'PAS_1'){
            return PAS_1
        }
        if(image == 'SUNGLO_1'){
            return SUNGLO_1
        }
        else{
            return KA_1
        }
    }
  return (
    <>
    <ImageBackground source={images()} style={Styles.boxWisata} imageStyle={{borderRadius: 10, opacity: 0.6}}>
        <View>
            <Text style={Styles.title}>{title}</Text>
            <Text style={Styles.Desc}>{desc}</Text>
        </View>
        <View/>
    </ImageBackground>
    <Gap height={10}/>
    </>
  )
}

export default BoxImage