import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function SocialButton({ title, onPress, style }) {
  return <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>;
}
const styles = StyleSheet.create({ btn: { backgroundColor: '#1A1735', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 }, text: { color: '#fff', fontSize: 15 } });
