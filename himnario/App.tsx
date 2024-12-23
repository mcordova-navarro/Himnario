import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Card, Button, Title, Paragraph, Surface } from 'react-native-paper';

// Definimos el tipo de datos que vamos a manejar
interface Himno {
  id: number;
  titulo: string;
}

export default function App() {
  const [himnos, setHimnos] = useState<Himno[]>([]); // Estado para almacenar los himnos
  const [loading, setLoading] = useState(true); // Estado para controlar el indicador de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    // Hacer la solicitud al backend
    axios
      .get('http://192.168.0.11:5001/api/himnos') // Cambié localhost por tu IP local
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.titulo}</Title>
              <Paragraph>Descripción breve del himno</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => alert(`Descargando ${item.titulo}`)} mode="contained" style={styles.button}>
                Descargar
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
