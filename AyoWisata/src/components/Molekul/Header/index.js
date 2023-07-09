import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import { Button, Gap } from '../../Atom';
import { Colors, Fonts } from '../../../Utils';

const Header = ({onPress, title, type}) => {
  return (
    <View style={styles.container(type)}>
      <Button type='icon-only' icon= {type === 'dark' ? 'back-light' : 'back-dark'} onPress={onPress}/>
      <Text style={styles.text(type)}>{title}</Text>
      <Gap width={24} />
    </View>
  )
}
 
export default Header;
const styles = StyleSheet.create({
  container: (type)=>({
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: type === 'dark' ? Colors.primary : Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
  }),
  text : (type) =>({
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontFamily: Fonts.primary[900],
    color: type === 'dark' ? Colors.white : Colors.primary,
    fontWeight: 'bold'
  })
})