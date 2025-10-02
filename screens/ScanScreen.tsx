import React, { useState } from 'react';
import { View, Text, Platform, Alert, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { CameraView, useCameraPermissions } from 'expo-camera';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>카메라는 모바일에서만 작동합니다.</Text>
      </View>
    );
  }

  if (!permission) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>권한 확인 중…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Text>카메라 권한이 필요합니다.</Text>
        <Pressable onPress={requestPermission} style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}>
          <Text>권한 요청</Text>
        </Pressable>
      </View>
    );
  }

  const handleScanned = (res: any) => {
    if (locked) return;
    setLocked(true);
    try {
      // 기대 포맷: JSON {"peerId":"...", "name":"..."} 또는 단순 문자열 peerId
      let peerId = '';
      let name = '상대';

      if (typeof res?.data === 'string') {
        const s = res.data.trim();
        if (s.startsWith('{')) {
          const obj = JSON.parse(s);
          peerId = obj.peerId ?? '';
          name = obj.name ?? name;
        } else {
          peerId = s;
        }
      }

      if (!peerId) throw new Error('유효한 QR이 아닙니다.');

      navigation.replace('Chat', { peerId, name });
    } catch (e: any) {
      Alert.alert('스캔 실패', e?.message ?? 'QR 파싱에 실패했습니다.', [
        { text: '확인', onPress: () => setLocked(false) },
      ]);
    }
  };

  return (
    <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={handleScanned}
      // barcodeScannerSettings={{ barcodeTypes: ['qr'] }} // 필요시 제한
    />
  );
}
