/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import { Firebase } from './src/config';
import { enableFreeze } from 'react-native-screens';

enableFreeze(true);

   Firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
 });


AppRegistry.registerComponent(appName, () => App);
