import { useFonts } from 'expo-font';
import { Stack, useRouter, Navigator } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/screens/start_page',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'pop': require('../assets/fonts/Poppins-Regular.ttf'),
    'pop-sb': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'pop-b': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
const isSignedIn = false;
  useEffect(() => {
    if(!isSignedIn){
      router.push('../screens/start_page')
    }
  })

  const router = useRouter();

  return (
      <Stack>
        <Stack.Screen name="screens/start_page" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/login" options={{
          headerTitleStyle: {
            fontFamily: 'pop-sb',
          },
          headerTitleAlign: 'center',
          headerTitle: 'Log in or sign up',
          presentation: 'fullScreenModal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28}/>
            </TouchableOpacity> 
          )
        }}/>
        <Stack.Screen name="listing/[id]" options={{headerTitle: '', headerTransparent: true}} />
        <Stack.Screen name="(modals)/court" options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28}/>
            </TouchableOpacity> 
          )
        }}/>
        <Stack.Screen name = "(modals)/mapInput" options={{
          headerTitleStyle: {
            fontFamily: 'pop-sb'
          },
          headerTitle: "Select location on map",
          headerTitleAlign: 'center',
          presentation: 'fullScreenModal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28}/>
            </TouchableOpacity> 
          )
        }}/>
        <Stack.Screen name="(modals)/addEvent" options={{
          headerTitleStyle: {
            fontFamily: 'pop-sb'
          },
          headerTitle: "Create event",
          headerTitleAlign: 'center',
          presentation: 'fullScreenModal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28}/>
            </TouchableOpacity> 
          )
        }}/>
         <Stack.Screen name="(modals)/events" options={{
          headerTitleStyle: {
            fontFamily: 'pop-sb'
          },
          headerTitle: "Upcoming events",
          headerTitleAlign: 'center',
          presentation: 'fullScreenModal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28}/>
            </TouchableOpacity> 
          )
        }}/>
      </Stack>
  );
}
