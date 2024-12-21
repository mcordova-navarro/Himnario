import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Definimos el tipo de datos que vamos a manejar
interface Himno {
  id: number;  // o string, según tu base de datos
  titulo: string;
}

export default function App() {
  const [himnos, setHimnos] = useState<Himno[]>([]); // Estado para almacenar los himnos
  const [loading, setLoading] = useState(true); // Estado para controlar el indicador de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    // Hacer la solicitud al backend
    axios
      .get('http://localhost:5000/api/himnos') // Asegúrate de que esta URL sea correcta
      .then((response) => {
        setHimnos(response.data); // Asigna los datos al estado
        setLoading(false); // Finaliza la carga
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setError('No se pudo cargar el himnario. Intenta de nuevo más tarde.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando himnario...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Himnario</Text>
      <FlatList
        data={himnos}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de que `id` sea único
        renderItem={({ item }) => (
          <Text style={styles.hymn}>{item.titulo}</Text> // Accede a `titulo` con seguridad
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
  error: {
    color: 'red',
    fontSize: 16,
  },
});
