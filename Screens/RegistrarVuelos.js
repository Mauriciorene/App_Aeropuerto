import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from '@rneui/themed'; // Para agregar el ícono de la "X" de eliminar

export default function RegistrarVuelos() {
  const [nombreVuelo, setNombreVuelo] = useState('');
  const [codigoVuelo, setCodigoVuelo] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleRegistroVuelo = async () => {
    // Validación de campos
    if (!nombreVuelo || !codigoVuelo || !precio || !duracion || imagenes.length === 0) {
      Alert.alert('Error', 'Por favor, complete todos los campos antes de registrar el vuelo');
      return;
    }

    try {
      setCargando(true);
      
      // Guardar datos en Firebase
      await addDoc(collection(db, 'Vuelos'), {
        nombreVuelo,
        codigoVuelo,
        precio: parseFloat(precio), // Convertir precio a numérico
        duracion: parseInt(duracion, 10), // Convertir duración a numérico
        imagenes: imagenes.map(img => img.uri),
      });

      Alert.alert('Éxito', 'Vuelo registrado con éxito');

      // Reiniciar campos de entrada
      setNombreVuelo('');
      setCodigoVuelo('');
      setPrecio('');
      setDuracion('');
      setImagenes([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el vuelo');
    } finally {
      setCargando(false);
    }
  };

  const seleccionarImagenes = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImagenes(result.assets);
    } else {
      Alert.alert('Error', 'No se pudo seleccionar las imágenes');
    }
  };

  // Función para eliminar una imagen de la lista
  const eliminarImagen = (index) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.title}>Registrar Vuelo</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del vuelo"
        value={nombreVuelo}
        onChangeText={setNombreVuelo}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Código del vuelo"
        value={codigoVuelo}
        onChangeText={setCodigoVuelo}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Duración (minutos)"
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="numeric"
      />

      <Button title="Seleccionar Imágenes" onPress={seleccionarImagenes} />

      <FlatList
        data={imagenes}
        keyExtractor={(item) => item.uri}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => eliminarImagen(index)} style={styles.deleteIcon}>
              <Icon name="close" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.buttonContainer}>
        <Button title="Registrar Vuelo" onPress={handleRegistroVuelo} disabled={cargando} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#A8D08D',
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 2,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
