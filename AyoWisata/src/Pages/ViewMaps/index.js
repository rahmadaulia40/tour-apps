import { View, Text } from 'react-native'
import React from 'react'
import { Colors, Styles } from '../../Utils'
import { Header } from '../../components'
import MapView, { Marker, Polyline }from 'react-native-maps';

const ViewMaps = ({navigation, route}) => {
    const data = route.params
    const coordinates = [
      { latitude: data.latitude, longitude: data.longitude }, // Koordinat Marker 1
      { latitude: data.latitudeUser, longitude: data.longitudeUser }, // Koordinat Marker 2
    ];

  const calculateDistance = () => {
    const R = 6371; // Radius bumi dalam kilometer
    const lat1 = data.latitude;
    const lon1 = data.longitude;
    const lat2 = data.latitudeUser;
    const lon2 = data.longitudeUser;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Jarak dalam kilometer
  };
  const RegionByDistance = () => {
    const distance = calculateDistance();
    const padding = 0.1; // Padding tambahan pada peta

    const latitudeDelta = distance / 111.32 + padding;
    const longitudeDelta =
      Math.abs(data.longitudeUser - data.longitude) /
        111.32 +
      padding;

    return {
      latitudeDelta,
      longitudeDelta,
    };
  };
  return (
    <View style={Styles.page}>
        <Header title='Lokasi Wisata' type='dark' onPress={()=> navigation.goBack()}/>
        <MapView
          style={{flex: 1}}
          region={{latitude : data.latitude, longitude : data.longitude, latitudeDelta : RegionByDistance().latitudeDelta, longitudeDelta : RegionByDistance().longitudeDelta}}
          onPanDrag={false}
        >
            <Marker
              coordinate ={coordinates[0]}
              title={data.name}
              description={data.location}
            />
            <Marker
              coordinate ={coordinates[1]}
              title='Lokasi Anda'
              description='Titik Lokasi sesuai dengan GPS'
              pinColor={Colors.primary}
            />
            <Polyline
              coordinates={coordinates}
              strokeColor={Colors.primary} // Warna garis
              strokeWidth={2} // Lebar garis
            />
        </MapView>
    </View>
  )
}

export default ViewMaps