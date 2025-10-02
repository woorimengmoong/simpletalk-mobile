import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

import ContactsScreen from './screens/ContactsScreen';
import ChatScreen from './screens/ChatScreen';
import ScanScreen from './screens/ScanScreen';
import MyQRScreen from './screens/MyQRScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Hello Codex</Text>
        </View>
        <Stack.Navigator screenOptions={{ contentStyle: styles.screen }}>
          <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: '연락처' }} />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ route }) => ({ title: route.params.name })}
          />
          <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'QR 스캔' }} />
          <Stack.Screen name="MyQR" component={MyQRScreen} options={{ title: '내 QR' }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  banner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#111827',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  screen: {
    backgroundColor: '#ffffff',
  },
});
