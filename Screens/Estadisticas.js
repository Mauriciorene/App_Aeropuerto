import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const Estadisticas = () => {
  const [vuelos, setVuelos] = useState([]);

  // Función para obtener los vuelos desde Firebase
  const obtenerVuelos = async () => {
    try {
      const vuelosRef = collection(db, 'Vuelos');
      const querySnapshot = await getDocs(vuelosRef);
      const vuelosData = querySnapshot.docs.map(doc => doc.data());
      setVuelos(vuelosData);
    } catch (error) {
      console.error('Error al obtener los vuelos:', error);
    }
  };

  useEffect(() => {
    obtenerVuelos();
  }, []);

  if (vuelos.length === 0) {
    return <Text>Cargando datos...</Text>;
  }

  const vuelosCaros = vuelos.filter(vuelo => vuelo.precio >= 6000).length;
  const vuelosBaratos = vuelos.filter(vuelo => vuelo.precio <= 5000).length;
  const totalVuelos = vuelos.length;

  const porcentajeVuelosCaros = (vuelosCaros / totalVuelos) * 100;
  const porcentajeVuelosBaratos = (vuelosBaratos / totalVuelos) * 100;

  const pieChartData = [
    {
      name: `Vuelos Caros  (${porcentajeVuelosCaros.toFixed(2)}%)`,
      population: porcentajeVuelosCaros,
      color: '#FF5733',
      legendFontColor: '#000',
      legendFontSize: 11,
    },
    {
      name: `Vuelos Baratos (${porcentajeVuelosBaratos.toFixed(2)}%)`,
      population: porcentajeVuelosBaratos,
      color: '#33FF57',
      legendFontColor: '#000',
      legendFontSize: 10,
    },
  ];

  const barChartData = {
    labels: vuelos.map(vuelo => vuelo.nombreVuelo),
    datasets: [
      {
        data: vuelos.map(vuelo => vuelo.precio),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const generarPDF = async (titulo, contenido) => {
    try {
      const contenidoHTML = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; color: #333; }
              ul { padding: 0; list-style: none; }
              li { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${titulo}</h1>
            <ul>
              ${contenido.map(
                (item, index) =>
                  `<li>${index + 1}. ${item}</li>`
              ).join('')}
            </ul>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html: contenidoHTML });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert('La funcionalidad de compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Estadísticas de Vuelos</Text>

        {/* Gráfico de Barras */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Comparación de Precios</Text>
          <BarChart
            data={barChartData}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            verticalLabelRotation={30}
            fromZero={true}
            style={styles.chart}
          />
          <Button
            title="Generar y Compartir el PDF"
            onPress={() =>
              generarPDF(
                'Comparación de Precios',
                vuelos.map(vuelo => `${vuelo.nombreVuelo} - $${vuelo.precio}`)
              )
            }
          />
        </View>

        {/* Gráfico de Pastel */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribución de los Precios</Text>
          <PieChart
            data={pieChartData}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
          <Button
            title="Generar y Compartir el PDF"
            onPress={() =>
              generarPDF('Distribución de Vuelos', [
                `Vuelos Caros: ${vuelosCaros} (${porcentajeVuelosCaros.toFixed(2)}%)`,
                `Vuelos Baratos: ${vuelosBaratos} (${porcentajeVuelosBaratos.toFixed(2)}%)`,
              ])
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D08D',
  },
  scrollViewContainer: {
    padding: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 30,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginBottom: 10,
  },
});

export default Estadisticas;
