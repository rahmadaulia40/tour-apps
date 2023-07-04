import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { GetStarted, Splash } from '../Pages';

const Stack = createStackNavigator();

export default Router = () => {
  return (
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen name="Splash" component={Splash} options={OptionsScreen}/>
      <Stack.Screen name="GetStarted" component={GetStarted} options={OptionsScreen}/>
    </Stack.Navigator>
  )
}

const OptionsScreen = {
  headerShown: false
}