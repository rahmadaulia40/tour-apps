import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { DetailWisata, Home, Splash, View360 } from '../Pages';

const Stack = createStackNavigator();

export default Router = () => {
  return (
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen name="Splash" component={Splash} options={OptionsScreen}/>
      <Stack.Screen name="Home" component={Home} options={OptionsScreen}/>
      <Stack.Screen name="DetailWisata" component={DetailWisata} options={OptionsScreen}/>
      <Stack.Screen name="View360" component={View360} options={OptionsScreen}/>
    </Stack.Navigator>
  )
}

const OptionsScreen = {
  headerShown: false
}