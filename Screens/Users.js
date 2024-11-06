import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const UsersScreen = () => {
    const handleOptionPress = (option) => {
        console.log(`${option} seleccionado`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={{ uri: '' }} 
                    style={styles.profileImage} 
                />
                <Text style={styles.userName}>Hernandez Salazar</Text>
                <Text style={styles.userSubtitle}>Viajero frecuente</Text>
            </View>

            <ScrollView style={styles.optionsContainer}>
                <Text style={styles.sectionTitle}>Información</Text>
                {['Mis Reservas de Vuelo', 'Estado de Vuelos disponibles', 'Mapa del Aeropuerto'].map(option => (
                    <TouchableOpacity 
                        key={option} 
                        style={styles.option} 
                        onPress={() => handleOptionPress(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>
                {['Centro de Ayuda', 'Guía del Aeropuerto', 'configuración', 'Enviar Comentarios'].map(option => (
                    <TouchableOpacity 
                        key={option} 
                        style={styles.option} 
                        onPress={() => handleOptionPress(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={() => handleOptionPress('Cerrar Sesión')}
                >
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f8ff', // Azul claro, estilo aeropuerto
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#d1d1d1',
        marginBottom: 10,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    userSubtitle: {
        fontSize: 16,
        color: '#555',
        fontStyle: 'italic',
    },
    optionsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#0067C6',
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#ff4d4d',
        borderRadius: 5,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UsersScreen;
