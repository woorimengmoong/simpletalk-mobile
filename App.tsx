import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
      <Stack.Navigator>
        <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: '연락처' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.name })} />
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'QR 스캔' }} />
        <Stack.Screen name="MyQR" component={MyQRScreen} options={{ title: '내 QR' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
