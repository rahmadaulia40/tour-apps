import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import Image360Viewer from '@hauvo/react-native-360-image-viewer'
import { KA_1, KA_360_1, KA_360_2, KA_360_3 } from '../../Assets'
import _ from 'lodash'

const View360 = ({route}) => {
    const image360 = route.params
    const images =  _.reverse([
        KA_360_1,
       //  KA_360_2,
        // KA_360_3
    ])
    const { width, height } = Dimensions.get('window')
  return (
    <View style={{ flex: 1 }}>
      <Image360Viewer 
        srcset={images} 
        width={width} 
        height={height} 
        
      />
    </View>
  )
}

export default View360