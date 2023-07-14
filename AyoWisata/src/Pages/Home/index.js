import React from 'react';
import { Text, View, ScrollView} from 'react-native';
import { BoxImage, Gap, HeaderImage } from '../../components';
import { Colors, EuclideanDistance, Styles } from '../../Utils';
import { DataWisata, Image_GetStarted, Image_Logo } from '../../Assets';

const Home = ({navigation, route}) => {
  const coordinate = route.params
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
              const CoordinateUser = [Number(coordinate.latitudeUser), Number(coordinate.longitudeUser)]
              const CoordinateWisata = [Number(item.latitude), Number(item.longitude)]
              const jarak = EuclideanDistance(CoordinateWisata, CoordinateUser).toString().slice(0,6)
              const newData = {...item, ...coordinate, jarak : jarak}
              return(
                <BoxImage
                  key={item.id}
                  image={images[0]}
                  title={item.name}
                  desc={item.location}
                  jarak={`${jarak} KM`}
                  onPress={()=> navigation.navigate('DetailWisata', newData)}
                />
              )
            })}

            <View style={{backgroundColor: Colors.primary, justifyContent: 'center', paddingVertical: 40}}>
              <Text style={Styles.header}>Temukan Wisata Seru Disekitarmu.</Text>
              <View style={{paddingLeft: 10}}>
                <Text style={Styles.Desc}>Destinasi seru yang dekat denganmu.</Text>
              </View>
              <Gap height={20}/>
            </View>
          </ScrollView>
        </View>
  )
}

export default Home

