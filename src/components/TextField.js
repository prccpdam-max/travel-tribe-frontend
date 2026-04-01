import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
export default function TextField({ style, ...props }) {
  return <TextInput style={[styles.input, style]} placeholderTextColor='#A0A0B0' {...props} />;
}
const styles = StyleSheet.create({ input: { backgroundColor: '#1A1735', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 12 } });
