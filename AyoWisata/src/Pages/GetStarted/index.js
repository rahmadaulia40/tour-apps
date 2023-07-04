import React from 'react';
import {Image, ImageBackground, Text, View, ScrollView} from 'react-native';
import { BoxImage, Button, Gap, HeaderImage } from '../../components';
import { Colors, Styles } from '../../Utils';
import { DataWisata, Image_GetStarted, Image_Logo, KA_1, MABAR_1, PAS_1, SUNGLO_1 } from '../../Assets/';

const GetStarted = ({navigation}) => {
  return (
      <View style={Styles.page}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <HeaderImage
              imageBackground={Image_GetStarted}
              logo={Image_Logo}
              header='Jelajahi Destinasi Seru Diseluruh Desa Simalungun'
            />

            <Gap height={50}/>
            <Text style={Styles.text}>Tempat Wisata</Text>

            {DataWisata.map(item=>{
              const images = item.image
              return(
                <BoxImage
                  key={item.id}
                  image={images[0]}
                  title={item.name}
                  desc={item.location}
                />
              )
            })}

            <View style={{backgroundColor: Colors.primary, justifyContent: 'center', paddingVertical: 40}}>
              <Text style={Styles.header}>Temukan Wisata Seru Disekitarmu.</Text>
              <View style={{paddingLeft: 10}}>
                <Text style={Styles.Desc}>Destinasi seru yang dekat denganmu.</Text>
              </View>
              <Gap height={15}/>
              <View style={{backgroundColor: Colors.tertiary, padding: 10, marginHorizontal: 20, alignItems: 'center', borderRadius: 5, elevation: 5}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: Colors.text.menuActive}}>Jelajahi Wisata</Text>
              </View>
            </View>

          </ScrollView>
        </View>
  )
}

export default GetStarted

