import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function RegistrarVuelos() {
  const [nombreVuelo, setNombreVuelo] = useState('');
  const [codigoVuelo, setCodigoVuelo] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleRegistroVuelo = async () => {
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
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
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
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
