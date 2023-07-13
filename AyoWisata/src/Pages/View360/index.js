import React, {useState} from 'react'
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import Image360Viewer from '@hauvo/react-native-360-image-viewer'
import { WebView } from 'react-native-webview';
import { Colors, Images360 } from '../../Utils';

const View360 = ({route}) => {
  const image360 = route.params
  const [viewImage, setviewImage] = useState(image360[0])

  const ButtonViewImage = ({onPress, number})=>{
      return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: Colors.primary, height: 40, width: 40, borderRadius: 20/2, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderColor: Colors.background, borderWidth: 2}}>
            <Text style={{fontSize: 26, fontWeight: 'bold', color: Colors.background}}>{number}</Text>
        </TouchableOpacity>
      )
  }

  const initialHTMLContent = `<!DOCTYPE html>
    <html>
    <head>
      <title>360 Degree View</title>
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/aframe/0.7.1/aframe.min.js"></script>
    </head>
    <body>
      <a-scene>
        <img id="panorama" src="${Images360(viewImage)}"/>
        <a-sky src="#panorama" rotation="0 -90 0"></a-sky>
      </a-scene>
    </body>
    </html>`;

  return (
    <>
      <StatusBar hidden={true}/>
      <View style={{ flex: 1}}>
        <WebView
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{
            html: initialHTMLContent,
          }}
        />
      </View>
      <View style={{position: 'absolute', margin: 10, flexDirection : 'row', justifyContent: 'space-between'}}>
        {image360.map(res=>{
          const number = res.slice(-1)
          return (
            <ButtonViewImage
              key={number}
              number={number}
              onPress={()=>setviewImage(image360[Number(number)-1])}
            />
          )
        })}
      </View>
    </>
  )
}

export default View360