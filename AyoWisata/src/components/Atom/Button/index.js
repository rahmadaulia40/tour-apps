import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Colors, Fonts } from '../../../Utils';

const Button = ({type, title, onPress, icon, disable, color}) => {
  if(disable){
    return (
      <View style={styles.disableBg}>
          <Text style={styles.disableText}>{title}</Text>
      </View>
    )
  }
  else if(type === 'btn-left-right'){
    return (
      <TouchableOpacity style={styles.container1(color)} onPress={onPress}>
          <Text style={styles.title1(color)}>{title}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity style={styles.container(type)} onPress={onPress}>
        <Text style={styles.title(type)}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  container : (type)=>({
    backgroundColor: type === 'secondary' ? Colors.button.secondary.background : Colors.button.primary.background,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 5,
    flex: 1,
    marginHorizontal: 10
    
  }),
  title :(type)=>({
    fontSize : 15,
    textAlign: 'center',
    color: type === 'secondary' ? Colors.button.secondary.text : Colors.button.primary.text,
    fontFamily : Fonts.primary[600],
  }),
  disableBg : {
    backgroundColor: Colors.button.disable.background,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10
  },
  disableText : {
    fontSize : 15,
    textAlign: 'center',
    color: Colors.text.menuInactive,
    fontFamily : Fonts.primary[600]
  },
  container1 : (type)=>({
    backgroundColor: type === 'primary' ? Colors.button.secondary.background : Colors.button.primary.background,
    paddingVertical: 10,
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }),
  title1 :(type)=>({
    fontSize : 15,
    textAlign: 'center',
    color: type === 'primary' ? Colors.button.secondary.text : Colors.button.primary.text,
    fontFamily : Fonts.primary[600],
  }),
})