import React, {useState} from 'react'
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import Image360Viewer from '@hauvo/react-native-360-image-viewer'
import { WebView } from 'react-native-webview';
import { Colors, Images360 } from '../../Utils';
import { Header } from '../../components';

const View360 = ({route, navigation}) => {
  const image360 = route.params
  const [viewImage, setviewImage] = useState(image360[0])

  const ButtonViewImage = ({onPress, number, name})=>{
      return (
            <TouchableOpacity onPress={onPress} style={{backgroundColor: name == viewImage ? Colors.background : Colors.primary, height: 30, width: 50, borderRadius: 20/2, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderColor: name == viewImage ? Colors.primary : Colors.background, borderWidth: 2}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: name == viewImage ? Colors.primary : Colors.background}}>{number}</Text>
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
      <View style={{ flex: 1}}>
      <Header title='Virtual Tour' type='dark' onPress={()=> navigation.goBack()}/>
        <WebView
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{
            html: initialHTMLContent,
          }}
        />
      </View>
      <View style={{position: 'absolute', flexDirection : 'row', justifyContent: 'space-between', alignSelf: 'center', bottom: 10}}>
        {image360.map(res=>{
          const number = res.slice(-1)
          return (
            <ButtonViewImage
              key={number}
              number={number}
              name={res}
              onPress={()=>setviewImage(image360[Number(number)-1])}
            />
          )
        })}
      </View>
    </>
  )
}

export default View360