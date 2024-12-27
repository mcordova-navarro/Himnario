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
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';

interface Himno {
  _id: string;
  title: string;
  number: number;
  fuente?: string;
  verses?: string[];
  chorus?: string;
  views?: number;
}

export default function App() {
  const [himnos, setHimnos] = useState<Himno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedHimno, setSelectedHimno] = useState<Himno | null>(null);
  const [dragging, setDragging] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (!dragging) setDragging(true);
        scrollX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 100) {
          setCurrentPage('Home');
        } else if (gestureState.dx < -100) {
          setCurrentPage('Himno');
        }
        Animated.spring(scrollX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        setDragging(false);
      },
    })
  ).current;

  useEffect(() => {
    const fetchHimnos = () => {
      axios
        .get('http://192.168.144.17:5001/himnarios/mas-buscados?limit=3')
        .then((response) => {
          setHimnos(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener los datos:', error);
          setError('No se pudo cargar los himnos más buscados. Intenta de nuevo más tarde.');
          setLoading(false);
        });
    };

    fetchHimnos();

    const intervalId = setInterval(fetchHimnos, 30000); // Actualiza cada 30 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
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

  const renderHimnoDetails = () => {
    if (!selectedHimno) return null;
    return (
      <View style={styles.himnoDetailsContainer}>
        <Text style={styles.himnoTitle}>{selectedHimno.title}</Text>
        <Text style={styles.himnoNumber}>Himno Nº {selectedHimno.number}</Text>
        {selectedHimno.verses?.map((verse, index) => (
          <Text key={index} style={styles.himnoVerse}>{verse}</Text>
        ))}
        {selectedHimno.chorus && (
          <Text style={styles.himnoChorus}>{selectedHimno.chorus}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Barra de navegación superior, que solo aparece en la pantalla de Himno */}
      {currentPage === 'Himno' && (
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.icon} onPress={() => { /* Función para reproducir */ }}>
            <MaterialIcons name="play-arrow" size={30} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={() => { /* Función para cambiar tamaño de letras */ }}>
            <MaterialIcons name="text-fields" size={30} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={() => { /* Función de búsqueda */ }}>
            <MaterialIcons name="search" size={30} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={() => { /* Función para mostrar abreviación */ }}>
            <Text style={styles.abbreviation}>HM 🌐</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Pantalla Home */}
      {currentPage === 'Home' && (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.icon}>
              <MaterialIcons name="notifications" size={30} color="#6200ee" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <MaterialIcons name="person" size={30} color="#6200ee" />
            </TouchableOpacity>
          </View>
          <Text style={styles.header}>Más Buscados</Text>
          <FlatList
            data={himnos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Surface style={styles.card}>
                <TouchableOpacity onPress={() => {
                  setSelectedHimno(item);
                  setCurrentPage('Himno');
                }}>
                  <View style={styles.cardContent}>
                    <MaterialIcons name="language" size={24} color="#6200ee" style={styles.icon} />
                    <View style={styles.textContainer}>
                      <Text style={styles.himnoTitle}>{item.title}</Text>
                      <Text style={styles.himnoDetails}>Himnario {item.number}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Surface>
            )}
          />
        </>
      )}

      {/* Pantalla de Himno */}
      {currentPage === 'Himno' && (
        <Animated.View style={styles.pageView}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentPage('Home')}
          >
            <Text style={styles.backButtonText}>{'< Regresar'}</Text>
          </TouchableOpacity>
          {renderHimnoDetails()}
        </Animated.View>
      )}

      {/* Botón deslizable */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        <TouchableOpacity style={styles.slideButton}>
          <Text style={styles.buttonText}>Deslízame</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentPage('Home')}
        >
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
  },
  topBar: {
    position: 'absolute',
    top: 40,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 15,
  },
  abbreviation: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 100,
    marginVertical: 10,
    color: '#6200ee',
    textAlign: 'center',
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
    marginLeft: 10,
  },
  himnoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  himnoDetails: {
    fontSize: 14,
    color: '#666',
  },
  pageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200ee',
  },
  himnoDetailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  himnoNumber: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  himnoVerse: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444',
  },
  himnoChorus: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
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
  buttonContainer: {
    width: 250,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#e3e3e3',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 30,
  },
  slideButton: {
    width: 100,
    height: 40,
    backgroundColor: '#6200ee',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    opacity: 0.9,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
