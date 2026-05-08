import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// Importación corregida hacia constants/theme
import { globalStyles } from '../../constants/theme';

export default function App() {
  const router = useRouter();

  return (
    <View style={globalStyles.header}>
      <Text style={globalStyles.title}>Hola!!!</Text>
      <Text style={globalStyles.subtitle}>USUARIO</Text>
      <Text style={globalStyles.date}>08/05/2026</Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push('./detalles')}
      >
        <Text style={globalStyles.buttonText}>INGRESAR</Text>
      </TouchableOpacity>
    </View>
  );
}