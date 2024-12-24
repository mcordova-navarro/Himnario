import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import axios from 'axios';
import { MaterialIcons, Feather } from '@expo/vector-icons'; // Para íconos
import { Surface } from 'react-native-paper';

interface Himno {
  _id: string;
  title: string;
  number: number;
  fuente: string;  // Este campo parece ser el tipo de himnario
}

export default function App() {
  const [himnos, setHimnos] = useState<Himno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('Home'); // Control para cambiar entre pantallas
  const [dragging, setDragging] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;

  // Control para el gesto deslizante
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (!dragging) setDragging(true);
        // Actualizamos la posición de desplazamiento
        scrollX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 100) {
          setCurrentPage('Himno');
        } else if (gestureState.dx < -100) {
          setCurrentPage('Home');
        }
        // Reseteamos el valor del desplazamiento
        Animated.spring(scrollX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        setDragging(false);
      },
    })
  ).current;

  useEffect(() => {
    axios
      .get('http://192.168.0.11:5001/himnarios/mas-buscados?limit=3') // Endpoint para más buscados
      .then((response) => {
        const himnosFiltrados = response.data.map((himno: any) => ({
          _id: himno._id,
          title: himno.title,
          number: himno.number,
          fuente: himno.fuente,
        }));
        setHimnos(himnosFiltrados);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setError('No se pudo cargar los himnos más buscados. Intenta de nuevo más tarde.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Cargando himnario...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Barra de navegación superior */}
      <View style={styles.topBar}>
        <MaterialIcons name="notifications" size={30} color="#6200ee" style={styles.icon} />
        <MaterialIcons name="account-circle" size={30} color="#6200ee" style={styles.icon} />
      </View>

      {/* "Más Buscados" y lista de himnos */}
      <Text style={styles.header}>Más Buscados</Text>
      <FlatList
        data={himnos}
        keyExtractor={(item) => item._id} // Usa _id si es único
        renderItem={({ item }) => (
          <Surface style={styles.card}>
            <View style={styles.cardContent}>
              {/* Símbolo del mundo */}
              <MaterialIcons name="language" size={24} color="#6200ee" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.himnoTitle}>{item.title}</Text>
                <View style={styles.detailsContainer}>
                  {/* Número del himnario y nombre completo */}
                  <Text style={styles.himnoDetails}>
                    Himnario {item.number} - {item.fuente}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        )}
      />

      {/* Animación para el cambio entre "Home" y "Himno" */}
      <Animated.View
        style={[
          styles.pageView,
          {
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange: [-200, 0, 200],
                  outputRange: [-300, 0, 300],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        {currentPage === 'Home' && (
          <View style={styles.page}>
            <Text style={styles.pageText}>Página Home</Text>
          </View>
        )}
        {currentPage === 'Himno' && (
          <View style={styles.page}>
            <Text style={styles.pageText}>Página Himno</Text>
          </View>
        )}
      </Animated.View>

      {/* Barra de navegación inferior estática */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="home" size={24} color="#6200ee" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="book" size={24} color="#6200ee" />
          <Text style={styles.navText}>Himno</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="menu" size={24} color="#6200ee" />
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 10,
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  icon: {
    marginLeft: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 100, // Mueve la cabecera más abajo
    marginVertical: 10,
    color: '#6200ee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  himnoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  himnoDetails: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  pageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  pageText: {
    fontSize: 20,
    color: '#6200ee',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
    color: '#6200ee',
  },
});
