import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ensureMe } from '../lib/storage';

export default function MyQRScreen() {
  const [me, setMe] = useState<{ userId: string; name?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const m = await ensureMe();
      setMe(m);
    })();
  }, []);

  if (!me) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>불러오는 중…</Text></View>;
  }

  const payload = JSON.stringify({ peerId: me.userId, name: me.name ?? '사용자' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <QRCode value={payload} size={220} />
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{me.name ?? '사용자'}</Text>
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{me.userId}</Text>
      </View>
      <Text style={{ fontSize: 12, color: '#6b7280' }}>상대방은 이 QR을 스캔하면 채팅으로 바로 이동합니다.</Text>
    </View>
  );
}
