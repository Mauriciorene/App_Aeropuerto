import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const Estadisticas = () => {
  const [vuelos, setVuelos] = useState([]);
  const [vuelosCarosYBaratos, setVuelosCarosYBaratos] = useState(null);

  // Función para obtener los vuelos desde Firebase
  const obtenerVuelos = async () => {
    try {
      const vuelosRef = collection(db, 'Vuelos');
      const querySnapshot = await getDocs(vuelosRef);
      const vuelosData = querySnapshot.docs.map(doc => doc.data());
      setVuelos(vuelosData);

      // Encontrar el vuelo más caro y el más barato
      const { vueloMasCaros, vueloMenosCostoso } = obtenerVuelosMasCarosYMenosCostosos(vuelosData);
      setVuelosCarosYBaratos({ vueloMasCaros, vueloMenosCostoso });
    } catch (error) {
      console.error('Error al obtener los vuelos:', error);
    }
  };

  // Función para calcular el vuelo más caro y el más barato
  const obtenerVuelosMasCarosYMenosCostosos = (vuelos) => {
    let vueloMasCaros = vuelos[0];
    let vueloMenosCostoso = vuelos[0];

    vuelos.forEach(vuelo => {
      if (vuelo.precio > vueloMasCaros.precio) {
        vueloMasCaros = vuelo;
      }
      if (vuelo.precio < vueloMenosCostoso.precio) {
        vueloMenosCostoso = vuelo;
      }
    });

    return { vueloMasCaros, vueloMenosCostoso };
  };

  // Función para generar y compartir un PDF
  const generarPDF = async () => {
    try {
      // Crear contenido HTML para el PDF
      const contenidoHTML = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              h1 {
                text-align: center;
                color: #333;
              }
              ul {
                padding: 0;
                list-style: none;
              }
              li {
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <h1>Estadísticas de Vuelos</h1>
            <ul>
              ${vuelos.map(
                (vuelo, index) =>
                  `<li>${index + 1}. ${vuelo.nombreVuelo} - $${vuelo.precio}</li>`
              ).join('')}
            </ul>
          </body>
        </html>
      `;

      // Generar el PDF
      const { uri } = await Print.printToFileAsync({ html: contenidoHTML });
      console.log('PDF generado en:', uri);

      // Compartir el PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert('La funcionalidad de compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  // Llamamos a obtener los vuelos cuando el componente se monta
  useEffect(() => {
    obtenerVuelos();
  }, []);

  // Si no se han cargado los vuelos aún, mostrar mensaje de carga
  if (!vuelosCarosYBaratos) {
    return <Text>Cargando datos...</Text>;
  }

  const { vueloMasCaros, vueloMenosCostoso } = vuelosCarosYBaratos;

  // Filtrar los vuelos caros y baratos
  const vuelosCaros = vuelos.filter(vuelo => vuelo.precio >= vueloMasCaros.precio).length;
  const vuelosBaratos = vuelos.filter(vuelo => vuelo.precio <= vueloMenosCostoso.precio).length;

  // Calcular los porcentajes de vuelos caros y baratos
  const totalVuelos = vuelos.length;

  const porcentajeVuelosCaros = (vuelosCaros / totalVuelos) * 100;
  const porcentajeVuelosBaratos = (vuelosBaratos / totalVuelos) * 100;

  // Datos para el gráfico de pastel
  const data = [
    {
      name: `Vuelos Caros (${porcentajeVuelosCaros.toFixed(2)}%)`,
      population: porcentajeVuelosCaros,
      color: '#FF5733',
      legendFontColor: '#000',
      legendFontSize: 15,
    },
    {
      name: `Vuelos Baratos (${porcentajeVuelosBaratos.toFixed(2)}%)`,
      population: porcentajeVuelosBaratos,
      color: '#33FF57',
      legendFontColor: '#000',
      legendFontSize: 15,
    },
  ];

  // Datos para el gráfico de barras
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
          <Button title="Generar y Compartir el PDF" onPress={generarPDF} />
        </View>

        {/* Gráfico de Pastel */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribución de Vuelos Caros y Baratos</Text>
          <PieChart
            data={data}
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
          <Button title="Generar y Compartir el PDF" onPress={generarPDF} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Vuelo Más Caro: {vueloMasCaros.nombreVuelo} - ${vueloMasCaros.precio}</Text>
          <Text style={styles.infoText}>Vuelo Menos Costoso: {vueloMenosCostoso.nombreVuelo} - ${vueloMenosCostoso.precio}</Text>
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
    width: '90%',
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
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default Estadisticas;
