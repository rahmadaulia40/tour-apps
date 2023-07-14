import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ImageSlider from 'react-native-image-slider';
import { Colors, Currency, Images, Styles } from '../../Utils';
import { Button, Gap, Header } from '../../components';

const DetailWisata = ({route, navigation}) => {
  const data = route.params
  const image360 = data.image360
  const OldPicture = data.image;
  const newPicture = []
  for(i=0;i<OldPicture.length;i++){
    newPicture.push(Images(OldPicture[i]))
  }

  return (
    <View style={Styles.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title='Detail Wisata' type='dark' onPress={()=> navigation.goBack()}/>
        <View style={{height: 200}}>
          <ImageSlider
            loopBothSides
            autoPlayWithInterval={3000}
            images={newPicture}
          />
        </View>
        <Gap height={10}/>
        <Text style={Styles.text}>{data.name}</Text>
        <Text style={Styles.header2}>{data.location}</Text>
        <View style={Styles.liner}/>
        <Gap height={10}/>

        <Text style={Styles.header2}>Deskripsi :</Text>
        <Text style={Styles.Desc2}>{data.Description}</Text>
        <Gap height={10}/>
        <View style={Styles.liner}/>
        <Gap height={10}/>

        <View style={{backgroundColor: Colors.primary, justifyContent: 'center', paddingVertical: 40}}>
          <Text style={Styles.header}>Lihat Wisata Dengan View 360°</Text>
          <View style={{paddingLeft: 10}}>
            <Text style={Styles.Desc}>Destinasi seru dengan View 360°</Text>
          </View>
          <Gap height={15}/>
          <Button title='View 360°' type='secondary' onPress={()=> navigation.navigate('View360', image360)}/>
        </View>
        <View style={Styles.liner}/>
        <Gap height={10}/>

        <Text style={Styles.header2}>Fasilitas :</Text>
        {data.fasilitas.map((res)=>{
          return <Text key={res} style={Styles.Desc2}> - {res}</Text>
        })}
        <View style={Styles.liner}/>
        <Gap height={10}/>

        <Text style={Styles.header2}>Biaya :</Text>
        <Text style={Styles.Desc2}> - Individual : {data.biaya.individual}</Text>
        <Text style={Styles.Desc2}> - Motor : Rp.{Currency(Number(data.biaya.motor))}</Text>
        <Text style={Styles.Desc2}> - Becak : Rp.{Currency(Number(data.biaya.becak))}</Text>
        <Text style={Styles.Desc2}> - Mobil : Rp.{Currency(Number(data.biaya.mobil))}</Text>
        <Text style={Styles.Desc2}> - Kamar Mandi : Rp.{Currency(Number(data.biaya.kamarmandi))}</Text>
        <Text style={Styles.Desc2}> - Pondok : Rp.{Currency(Number(data.biaya.pondok))}</Text>
        <Text style={Styles.Desc2}> - Ban : Rp.{Currency(Number(data.biaya.ban))}</Text>
        <View style={Styles.liner}/>
        <Gap height={10}/>

        <Text style={Styles.header2}>Peraturan :</Text>
        {data.peraturan.map((res)=>{
          return <Text key={res} style={Styles.Desc2}> - {res}</Text>
        })}
        <View style={Styles.liner}/>
        <Gap height={10}/>

        <View style={{backgroundColor: Colors.primary, justifyContent: 'center', paddingVertical: 40}}>
          <Text style={Styles.header}>Perjalan Menjadi Lebih Seru.</Text>
          <View style={{paddingLeft: 10}}>
            <Text style={Styles.Desc}>Lakukan perjalanan dengan Google Maps.</Text>
          </View>
          <Gap height={15}/>
          <Button title='Lihat di Maps' type='secondary' onPress={()=>navigation.navigate('ViewMaps', data)}/>
        </View>

      </ScrollView>
    </View>
  )
}

export default DetailWisata