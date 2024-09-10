import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import fetchData from '../utils/fetchdata';
import Card from '../components/Card/Card'; // Usamos la Card sin botones de edición y eliminación.

const FacturaSujetoExcluido = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Obtener datos de la API al montar el componente.
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const data = await fetchData('factura_sujeto_excluido', 'readAll');
        if (data.status) {
          setUsuarios(data.dataset);
          setFilteredData(data.dataset);
        } else {
          console.error('Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromApi();
  }, []);

  // Filtrar datos según la consulta de búsqueda.
  useEffect(() => {
    const filterData = () => {
      if (searchQuery === '') {
        setFilteredData(usuarios);
      } else {
        const filtered = usuarios.filter(item =>
          item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.nombre_cliente && item.nombre_cliente.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredData(filtered);
      }
    };

    filterData();
  }, [searchQuery, usuarios]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios de sujeto excluido</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por descripción o cliente"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id_factura.toString()}
        renderItem={({ item }) => <Card data={item} />}
        ListEmptyComponent={<Text>No hay datos disponibles</Text>}
      />
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default FacturaSujetoExcluido;