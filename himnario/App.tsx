import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Datos de ejemplo
const himnos = [
  { id: '1', titulo: 'Santo, Santo, Santo' },
  { id: '2', titulo: 'Cuan Grande es Él' },
  { id: '3', titulo: 'Alabaré' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Himnario</Text>
      <FlatList
        data={himnos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.hymn}>{item.titulo}</Text>
        )}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  hymn: {
    fontSize: 18,
    marginVertical: 5,
  },
});
