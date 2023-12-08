import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Profile from './app/screens/Profile';
import CreateAccount from './app/screens/CreateAccount';
import 'react-native-gesture-handler';
import Navigation from './Navigation';


//const Stack = createNativeStackNavigator();

export default function App() {
  return <Navigation/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
