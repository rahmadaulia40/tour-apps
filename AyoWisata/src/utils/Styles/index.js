import {StyleSheet} from 'react-native';
import { Colors } from '../Colors';
import { Fonts } from '../Fonts';

export const Styles = StyleSheet.create({
    page : {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: Colors.background
    },
    pageSplash : {
      flex: 1,
      justifyContent: 'center'
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.text.primary,
      paddingBottom: 5,
      paddingHorizontal: 10
    },
    header : {
      fontSize : 24,
      color : 'white',
      fontFamily: Fonts.primary[800],
      fontWeight: 'bold',
      paddingHorizontal: 10,
    },
    header2 : {
      color: Colors.text.primary,
      marginHorizontal: 10,
      fontWeight: 'bold',
      fontSize: 16,
      paddingBottom: 5
    },
    title : {
      fontSize : 22,
      color : 'white',
      fontFamily: Fonts.primary[800],
      fontWeight: 'bold'
    },
    Desc : {
      fontSize : 16,
      color : 'white',
      fontFamily: Fonts.primary[800],
    },
    Desc2 : {
      color: Colors.text.menuInactive,
      marginHorizontal: 10,
      textAlign: 'justify'
    },
    titleSplash : {
      color: Colors.text.secondary,
      fontWeight: 'bold',
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center'
    },
    logo: {
      height: '100%',
      width: '60%',
      marginLeft: -25
      
    },
    logoSplash: {
      height: '60%',
      width: '70%',
      alignSelf: 'center'
      
    },
    image: {
      aspectRatio: 1 * 3.5,
    },
    imageSplash: {
      paddingTop: 50,
      aspectRatio: 1 * 1,
    },
    imageGetStartedBox: {
      height: 200,
      width: '100%',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomWidth: 20
    },
    button : {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    boxWisata: {
      height: 150,
      padding: 10,
      marginHorizontal: 10,
      justifyContent: 'space-between',
      backgroundColor: 'black',
      borderRadius: 10,
      elevation: 10
    },
    liner : {
      marginHorizontal: 10,
      marginTop: 10,
      backgroundColor: Colors.primary,
      height: 1,
      opacity: 0.5
    }
  })