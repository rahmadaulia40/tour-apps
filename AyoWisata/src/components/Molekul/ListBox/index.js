import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { IconAdd } from '../../../assets'
import { colors, fonts, getNumber } from '../../../utils'
import { Gap } from '../../Atom'

const ListBox = ({item, onPress}) => {
  if (item.stock == 0 ){
    return (
      <View style={{marginTop: 15, marginBottom: -10}}>
        <View style={styles.container2}>
          <View style={styles.content}>
              <Text style={styles.name2}>{item.namaBarang}</Text>
              <Text style={styles.name2}>Rp.{getNumber(item.hargaJual)},-</Text>
          </View>
          <Gap width={20}/>
          <View onPress={onPress} style={styles.button}>
              <Text style={styles.name2}>Stok : {getNumber(item.stock)} {item.satuanBarang}</Text>
          </View>
        </View>
      </View>
    )
  }
  else {
    return (
      <View style={{marginTop: 15, marginBottom: -10}}>
        <View style={styles.container}>
          <View style={styles.content}>
              <Text style={styles.name}>{item.namaBarang}</Text>
              <Text style={styles.name}>Rp.{getNumber(item.hargaJual)},-</Text>
          </View>
          <Gap width={20}/>
          <TouchableOpacity onPress={onPress} style={styles.button}>
              <Text style={styles.name}>Stok : {getNumber(item.stock)} {item.satuanBarang}</Text>
              <IconAdd/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default ListBox

const width = Dimensions.get('window').width-40
const styles = StyleSheet.create({
  container : {
    width : width/2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    elevation: 10,
    marginHorizontal: 10,
  },
  content : {
    margin: 5
  },
  name : {
    fontSize : 14,
    fontFamily : fonts.primary[800],
    color : colors.text.menuActive,
    marginLeft: 5,
    marginRight: 5,
  },
  container2 : {
    width : width/2,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border.onBlur,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  name2 : {
    fontSize : 14,
    fontFamily : fonts.primary[800],
    color : colors.text.menuInactive,
    marginLeft: 5,
    marginRight: 5,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5
  }
})