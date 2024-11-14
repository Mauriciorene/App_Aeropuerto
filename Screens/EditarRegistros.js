// EditarRegistros.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Image, Modal } from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import { collection, onSnapshot, getFirestore, doc, deleteDoc } from "firebase/firestore"; 
import { appFirebase } from '../database/firebaseconfig.js';
import EditarVueloModal from './EditarVueloModal';

const EditarRegistros = () => {
    const db = getFirestore(appFirebase);
    const [listaVuelos, setListaVuelos] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [vueloSeleccionado, setVueloSeleccionado] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Vuelos"), (querySnapshot) => {
            const vuelos = [];
            querySnapshot.forEach((doc) => {
                const { nombreVuelo, codigoVuelo, precio, duracion, imagenes } = doc.data();
                vuelos.push({
                    id: doc.id,
                    descripcion: nombreVuelo || 'Nombre no disponible',
                    codigoVuelo: codigoVuelo || 'Código de vuelo no disponible',
                    precio: precio || 'Precio no disponible',
                    duracion: duracion || 'Duración no disponible',
                    imagenes: Array.isArray(imagenes) ? imagenes : [],
                });
            });
            setListaVuelos(vuelos);
            setFilteredData(vuelos);
        });

        return () => unsubscribe();
    }, []);

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

    const eliminarVuelo = async (id) => {
        await deleteDoc(doc(db, "Vuelos", id));
    };

    const abrirModalEditar = (vuelo) => {
        setVueloSeleccionado(vuelo);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setVueloSeleccionado(null);
        setModalVisible(false);
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
                            <View style={styles.buttonContainer}>
                                <Button
                                    icon={<Icon name="edit" color="#fff" />}
                                    title="Editar"
                                    onPress={() => abrirModalEditar(vuelo)}
                                    buttonStyle={styles.botonEditar}
                                />
                                <Button
                                    icon={<Icon name="delete" color="#fff" />}
                                    title="Eliminar"
                                    onPress={() => eliminarVuelo(vuelo.id)}
                                    buttonStyle={styles.botonEliminar}
                                />
                            </View>
                        </Card>
                    </View>
                ))}
            </View>

            {vueloSeleccionado && (
                <Modal visible={isModalVisible} animationType="slide" onRequestClose={cerrarModal}>
                    <EditarVueloModal vuelo={vueloSeleccionado} cerrarModal={cerrarModal} />
                </Modal>
            )}
        </ScrollView>
    );
};

export default EditarRegistros;

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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    botonEditar: {
        backgroundColor: 'green',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    botonEliminar: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 15,
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
