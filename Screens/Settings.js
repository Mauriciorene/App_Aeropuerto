import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ConfiguracionScreen = () => {
    const [isNotificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isDarkTheme, setDarkTheme] = useState(false);

    const toggleNotifications = () => {
        setNotificationsEnabled(previousState => !previousState);
    };

    const toggleTheme = () => {
        setDarkTheme(previousState => !previousState);
    };

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceptar', onPress: () => console.log('Sesión cerrada') },
        ]);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Configuración de la Aplicación</Text>

        <View style={styles.option}>
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            />
        </View>

        <View style={styles.option}>
            <Text style={styles.optionText}>Tema Oscuro</Text>
            <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
            />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 18,
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'green',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ConfiguracionScreen;
