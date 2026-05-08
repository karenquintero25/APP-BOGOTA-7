import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Importación de tus archivos de datos
import paraderosGeo from '../../assets/data/paraderos.json'; 
import rutasGeoData from '../../assets/data/paraderos-sitp.json';

export default function DetallesScreen() {
  const [selectedParadero, setSelectedParadero] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  // Extraemos las características de los archivos JSON
  const features = (paraderosGeo as any).features || [];
  const todasLasRutas = (rutasGeoData as any).features || [];

  useEffect(() => {
    (async () => {
      // Solicitar permisos de GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita el GPS para mostrar tu ubicación.');
        return;
      }

      // Obtener ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = currentLocation.coords;
      setLocation(coords);

      // Zoom automático inicial a tu ubicación
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.005, // Zoom cercano para ver paraderos
          longitudeDelta: 0.005,
        }, 1500);
      }
    })();
  }, []);

  // Función para volver a centrar el mapa manualmente
  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true} // Muestra el punto azul de tu posición
        initialRegion={{
          latitude: 4.6585, 
          longitude: -74.0861,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        onPress={() => setSelectedParadero(null)}
      >
        {features.map((item: any, index: number) => {
          if (!item.geometry) return null;
          const [longitude, latitude] = item.geometry.coordinates;

          return (
            <Marker
              key={index}
              coordinate={{ latitude, longitude }}
              onPress={() => {
                const infoParadero = item.properties || {};
                const cenefaBusqueda = infoParadero.cenefa?.toString().trim().toUpperCase();

                // Cruce de datos entre paraderos y rutas
                const rutasEncontradas = todasLasRutas
                  .filter((r: any) => {
                    const c = r.properties?.cenefa?.toString().trim().toUpperCase();
                    return c === cenefaBusqueda;
                  })
                  .map((r: any) => r.properties);

                setSelectedParadero({
                  ...infoParadero,
                  misRutas: rutasEncontradas 
                });
              }}
            />
          );
        })}
      </MapView>

      {/* Botón flotante para centrar la ubicación */}
      <TouchableOpacity style={styles.locationButton} onPress={centerMap}>
        <Text style={{ fontSize: 22 }}>📍</Text>
      </TouchableOpacity>

      {/* Panel de información corregido */}
      {selectedParadero && (
        <View style={styles.infoPanel}>
          <View style={styles.indicator} />
          
          <Text style={styles.title}>{selectedParadero.nombre || "Paradero SITP"}</Text>
          <Text style={styles.subtitle}>Cenefa: {selectedParadero.cenefa || 'S/N'}</Text>
          
          <Text style={styles.rutaLabel}>Rutas comerciales disponibles:</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routesContainer}>
            {selectedParadero.misRutas && selectedParadero.misRutas.length > 0 ? (
              selectedParadero.misRutas.map((r: any, i: number) => (
                <View key={i} style={styles.rutaBadge}>
                  <Text style={styles.rutaText}>
                    {r.ruta_comercial || r.linea || "S/R"}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No se encontraron rutas vinculadas</Text>
            )}
          </ScrollView>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setSelectedParadero(null)}
          >
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  locationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoPanel: {
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    backgroundColor: 'white',
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    padding: 20, 
    paddingBottom: 40, 
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  indicator: { 
    width: 40, 
    height: 5, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 3, 
    alignSelf: 'center', 
    marginBottom: 15 
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  rutaLabel: { fontSize: 15, fontWeight: '700', marginBottom: 10, color: '#333' },
  routesContainer: { flexDirection: 'row', marginBottom: 10 },
  rutaBadge: { 
    backgroundColor: '#0033A0', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 10, 
    marginRight: 10,
    justifyContent: 'center'
  },
  rutaText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  noDataText: { color: '#999', fontStyle: 'italic', marginTop: 5 },
  closeButton: { 
    marginTop: 15, 
    backgroundColor: '#F44336', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  closeText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});