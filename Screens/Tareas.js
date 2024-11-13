import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Tareas() {
    const navigation = useNavigation(); // Obtener acceso a la navegación

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity 
                    style={styles.box} 
                    onPress={() => navigation.navigate('RegistrarVuelos')}
                >
                    <FontAwesome name="plane" size={40} color="green" />
                    <Text style={styles.text}>Registrar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.box} 
                    onPress={() => navigation.navigate('EditarRegistros')}
                >
                    <FontAwesome name="edit" size={40} color="green" />
                    <Text style={styles.text}>Editar</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.box} 
                onPress={() => navigation.navigate('Estadisticas')}
            >
                <AntDesign name="areachart" size={40} color="green" />
                <Text style={styles.text}>Estadísticas</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    box: {
        width: 120,
        height: 120,
        borderWidth: 2,
        borderColor: 'green',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginHorizontal: 10,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
});
