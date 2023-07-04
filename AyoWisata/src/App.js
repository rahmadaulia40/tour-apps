import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Router from './Router'
import { Colors } from './Utils';

export default App=()=> {
  LogBox.ignoreAllLogs()
  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <NavigationContainer>
          <Router/>
      </NavigationContainer>
    </>
  );
}