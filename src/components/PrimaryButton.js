import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function PrimaryButton({ title, onPress, style, disabled }) {
  return <TouchableOpacity style={[styles.btn, style]} onPress={onPress} disabled={disabled}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>;
}
const styles = StyleSheet.create({ btn: { backgroundColor: '#7B9FFF', padding: 14, borderRadius: 12, alignItems: 'center' }, text: { color: '#fff', fontWeight: 'bold', fontSize: 16 } });
