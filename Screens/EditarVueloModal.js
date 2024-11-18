import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import { doc, updateDoc } from "firebase/firestore"; 
import { getFirestore } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { appFirebase } from '../database/firebaseconfig.js';

const EditarVueloModal = ({ vuelo, cerrarModal }) => {
    const db = getFirestore(appFirebase);
    const [descripcion, setDescripcion] = useState(vuelo.descripcion);
    const [precio, setPrecio] = useState(vuelo.precio);
    const [duracion, setDuracion] = useState(vuelo.duracion);
    const [imagenes, setImagenes] = useState(vuelo.imagenes);

    const actualizarVuelo = async () => {
        // Validación de campos
        if (!descripcion.trim() || !precio || !duracion || imagenes.length === 0) {
            Alert.alert('Error', 'Por favor, complete todos los campos antes de guardar.');
            return;
        }
        
        const vueloRef = doc(db, "Vuelos", vuelo.id);
        await updateDoc(vueloRef, {
            nombreVuelo: descripcion,
            precio,
            duracion,
            imagenes
        });

        // Mostrar alerta después de actualizar
        Alert.alert('Éxito', 'Registro actualizado con éxito', [
            {
                text: 'OK',
                onPress: () => cerrarModal(),
            },
        ]);
    };

    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImagenes([...imagenes, ...result.assets.map((asset) => asset.uri)]);
        }
    };

    const eliminarImagen = (index) => {
        setImagenes(imagenes.filter((_, i) => i !== index));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <Text style={styles.label}>Precio Por Persona</Text>
            <TextInput
                style={styles.input}
                value={precio ? precio.toString() : ''}
                keyboardType="numeric"
                onChangeText={(text) => setPrecio(parseFloat(text) || '')}
            />

            <Text style={styles.label}>Duración (minutos)</Text>
            <TextInput
                style={styles.input}
                value={duracion ? duracion.toString() : ''}
                keyboardType="numeric"
                onChangeText={(text) => setDuracion(parseFloat(text) || '')}
            />

            <Text style={styles.label}>Imágenes</Text>
            <ScrollView horizontal style={styles.imageScroll} showsHorizontalScrollIndicator={false}>
                {imagenes.length > 0 ? (
                    imagenes.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                            <TouchableOpacity onPress={() => eliminarImagen(index)} style={styles.deleteIcon}>
                                <Icon name="close" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text>No hay imágenes disponibles</Text>
                )}
            </ScrollView>
            <Button title="Añadir Imagen" onPress={seleccionarImagen} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.botonCancelar} onPress={cerrarModal}>
                    <Text style={styles.botonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonGuardar} onPress={actualizarVuelo}>
                    <Text style={styles.botonText}>Guardar cambios</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditarVueloModal;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    imageScroll: {
        marginVertical: 10,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botonCancelar: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    botonGuardar: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    botonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
