import {useFonts} from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { Appearance } from 'react-native'
import { Colors } from '@/constants/theme'

// SplashScreen.preventAutoHideAsync();

export default function RootLayout(){
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme==='dark' ? Colors.dark: Colors.light

  return (
    <Stack screenOptions={{
      headerStyle: {backgroundColor: theme.headerBackground},
      headerTintColor: theme.text,
      headerShadowVisible: false
    }}>
      <Stack.Screen name="index" options={{headerShown:false, title: "Home"}}/>
      <Stack.Screen name="menu" options={{headerShown:false, title: "Menu", headerTitle: "Coffee Menu for Today"}}/>
      <Stack.Screen name="contact" options={{headerShown:false, title: "Contact", headerTitle: "Contact Us"}}/>
      <Stack.Screen name="modal" options={{headerShown:false}}/>
    </Stack>
  )
  
}