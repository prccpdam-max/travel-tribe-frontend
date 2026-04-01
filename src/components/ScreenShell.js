import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
export default function ScreenShell({ children, style }) {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#0D0B1E' } });
