import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import { collection, onSnapshot, getFirestore } from "firebase/firestore"; 
import { appFirebase } from '../database/firebaseconfig.js';

const Home = () => {
    const db = getFirestore(appFirebase); // Conexión con la base de datos
    const [listaVuelos, setListaVuelos] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Para el filtrado

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Vuelos"), (querySnapshot) => {
            const vuelos = [];
            querySnapshot.forEach((doc) => {
                const { nombreVuelo, codigoVuelo, precio, duracion, imagenes } = doc.data();
                console.log('Datos del vuelo:', doc.data());  // Verifica los datos de cada vuelo

                vuelos.push({
                    id: doc.id,
                    descripcion: nombreVuelo || 'Nombre no disponible',
                    codigoVuelo: codigoVuelo || 'Código de vuelo no disponible',
                    precio: precio || 'Precio no disponible',
                    duracion: duracion || 'Duración no disponible',
                    imagenes: Array.isArray(imagenes) ? imagenes : [],  // Asegura que sea un array
                });
            });
            setListaVuelos(vuelos);
            setFilteredData(vuelos); // Inicializa los datos filtrados
        });

        // Cleanup function to unsubscribe when the component is unmounted
        return () => unsubscribe();
    }, []);

    // Función para filtrar los vuelos según el texto ingresado
    const searchFilterFunction = (text) => {
        if (text) {
            const newData = listaVuelos.filter((item) => {
                const itemData = item.descripcion ? item.descripcion.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
        } else {
            setFilteredData(listaVuelos);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar vuelos..."
                    onChangeText={(text) => searchFilterFunction(text)}
                />
            </View>

            <View>
                {filteredData.map((vuelo) => (
                    <View style={styles.contenedorCard} key={vuelo.id}>
                        <Card>
                            <Card.Title style={styles.TextTituloCard}>{vuelo.descripcion}</Card.Title>
                            <Card.Divider />
                            <ScrollView horizontal style={styles.imageScroll} showsHorizontalScrollIndicator={false}>
                                {vuelo.imagenes && vuelo.imagenes.length > 0 ? (
                                    vuelo.imagenes.map((image, index) => (
                                        <Image
                                            key={index}
                                            style={styles.imageStyle}
                                            source={{ uri: image }}
                                        />
                                    ))
                                ) : (
                                    <Text style={styles.textoLista}>Imágenes no disponibles</Text>
                                )}
                            </ScrollView>
                            <Text style={styles.textoLista}>Código de vuelo: {vuelo.codigoVuelo}</Text>
                            <Text style={styles.textoLista}>Precio por Persona: {vuelo.precio ? vuelo.precio.toLocaleString() : 'Precio no disponible'}</Text>
                            <Text style={styles.textoLista}>Duración de Vuelo "minutos": {vuelo.duracion}</Text>
                            <Button
                                style={styles.botonStyle}
                                icon={<Icon name="send" color="#fff" />}
                                title="Consultar disponibilidad"
                            />
                        </Card>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    contenedorCard: {
        marginBottom: 20,
    },
    TextTituloCard: {
        fontSize: 20,
        color: "#3364ff",
    },
    textoLista: {
        marginBottom: 10,
    },
    botonStyle: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    imageScroll: {
        marginVertical: 10,
    },
    imageStyle: {
        width: 200,
        height: 200,
        marginRight: 10,
        borderRadius: 10,
    },
});
