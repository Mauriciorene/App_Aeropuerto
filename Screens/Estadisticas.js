import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, SafeAreaView, Alert } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import { jsPDF } from 'jspdf';

const Estadisticas = () => {
  const [vuelos, setVuelos] = useState([]);
  const barChartContainerRef = useRef(); // Referencia al contenedor del gráfico de barras
  const pieChartContainerRef = useRef(); // Referencia al contenedor del gráfico de pastel

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
      name: `  Menos accesibles    (${porcentajeVuelosCaros.toFixed(2)}%)`,
      population: porcentajeVuelosCaros,
      color: '#FF5733',
      legendFontColor: '#000',
      legendFontSize: 11,
    },
    {
      name: `     Accesibles            (${porcentajeVuelosBaratos.toFixed(2)}%)`,
      population: porcentajeVuelosBaratos,
      color: '#33FF57',
      legendFontColor: '#000',
      legendFontSize: 11,
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

  // Función para generar y compartir el PDF de un gráfico
  const generarPDF = async (chartRef, titulo, datos) => {
    try {
      if (!chartRef) {
        Alert.alert('Error', 'Referencia al gráfico no encontrada.');
        return;
      }

      // Capturar el gráfico como imagen
      const uri = await captureRef(chartRef, {
        format: 'png',
        quality: 1,
      });

      // Crear una instancia de jsPDF
      const doc = new jsPDF();
      doc.text(titulo, 10, 10);

      // Leer la imagen capturada y agregarla al PDF
      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, 'PNG', 10, 20, 180, 140); // Ancho: 180, Alto: 100

      // Agregar una tabla con los datos
      let startY = 170; // espacio entre la imagen y el listado en el pdf
      doc.text('Datos del Gráfico:', 10, startY);

      datos.forEach((dato, index) => {
        startY += 10;
        doc.text(`${index + 1}. ${dato.nombre}: ${dato.valor}`, 10, startY);
      });

      // Guardar el archivo PDF
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}${titulo.replace(/\s+/g, '_')}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'La funcionalidad de compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al generar o compartir el PDF:', error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Estadísticas de Vuelos</Text>

        {/* Gráfico de Barras */}
        <View ref={barChartContainerRef} style={styles.chartCard}>
          <Text style={styles.chartTitle}>Comparación de Precios</Text>
          <BarChart
            data={barChartData}
            width={310}
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
        </View>

        <View ref={barChartContainerRef} style={[styles.chartCard, { width: 270 }]}>
          <Button
            title="Generar y compartir PDF"
            onPress={() =>
              generarPDF(
                barChartContainerRef.current,
                'Comparación de Precios',
                vuelos.map(vuelo => ({ nombre: vuelo.nombreVuelo, valor: vuelo.precio }))
              )
            }
          />
        </View>

        {/* Gráfico de Pastel */}
        <View ref={pieChartContainerRef} style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribución de los Precios de los Vuelos por Persona</Text>
          <PieChart
            data={pieChartData}
            width={370}
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
            paddingLeft="10"
          />
        </View>

        <View ref={barChartContainerRef} style={[styles.chartCard, { width: 270 }]}>
        <Button
            title="Generar y compartir PDF"
            onPress={() =>
              generarPDF(
                pieChartContainerRef.current,
                'Distribución de Precios',
                [
                  { nombre: 'Menos accesibles', valor: `${porcentajeVuelosCaros.toFixed(2)}%` },
                  { nombre: 'Accesibles', valor: `${porcentajeVuelosBaratos.toFixed(2)}%` },
                ]
              )
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
