import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, ScrollView, StyleSheet } from 'react-native';
import Input from '../components/Inputs/Input_crud';
import Buttons from '../components/Buttons/Button';
import fetchData from '../utils/fetchdata';
import ComboBox from '../components/Combo box/ComboBox';
import * as Constantes from '../utils/constantes';

const App = () => {
  const ip = Constantes.IP;
  const [view, setView] = useState('list');
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    idFactura: '',
    descripcion: '',
    tipo_servicio: '',
    id_servicio: '',
    id_cliente: '',
    monto: '',
    fecha_emision: '',
  });

  const initialFormState = {
    idFactura: '',
    descripcion: '',
    tipo_servicio: '',
    id_servicio: '',
    id_cliente: '',
    monto: '',
    fecha_emision: '',
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const serviciosResponse = await fetchData('factura_sujeto_excluido', 'readAllservicio');
        if (serviciosResponse.status) {
          setServicios(serviciosResponse.dataset);
        } else {
          console.error('Error fetching services:', serviciosResponse.message);
        }

        const clientesResponse = await fetchData('factura_sujeto_excluido', 'readAllclientes');
        if (clientesResponse.status) {
          setClientes(clientesResponse.dataset);
        } else {
          console.error('Error fetching clients:', clientesResponse.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromApi();
  }, [ip]);

  useEffect(() => {
    if (view === 'create') {
      setForm(initialFormState);
    }
  }, [view]);

  const handleCreate = async () => {
    try {
      const data = await fetchData('factura', 'createRow', {
        descripcion: form.descripcion,
        tipo_servicio: form.tipo_servicio, // Asegúrate de que esta clave es 'tipo_servicio'
        id_servicio: form.id_servicio,
        id_cliente: form.id_cliente,
        monto: form.monto,
        fecha_emision: form.fecha_emision
      });
      if (data.status) {
        setView('list');
        refreshList();
      } else {
        Alert.alert('Error', data.message || 'Error al crear el registro');
      }
    } catch (error) {
      console.error('Error al crear el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al crear el registro');
    }
  };

  const handleUpdate = async () => {
    try {
      const data = await fetchData('factura_sujeto_excluido', 'updateRow', form);
      if (data.status) {
        setView('list');
        refreshList();
      } else {
        Alert.alert('Error', data.message || 'Error al actualizar el registro');
      }
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el registro');
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await fetchData('factura_sujeto_excluido', 'deleteRow', { idFactura: id });
      if (data.status) {
        refreshList();
      } else {
        Alert.alert('Error', data.message || 'Error al eliminar el registro');
      }
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al eliminar el registro');
    }
  };

  const refreshList = async () => {
    try {
      const data = await fetchData('factura_sujeto_excluido', 'readAll');
      setUsuarios(data.dataset || []);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await fetchData('factura_sujeto_excluido', 'readOne', { idFactura: id });
      if (data.status) {
        setForm({
          idFactura: data.dataset.id_factura,
          descripcion: data.dataset.descripcion,
          tipo_servicio: data.dataset.tipo_servicio,
          id_servicio: data.dataset.id_servicio,
          id_cliente: data.dataset.id_cliente,
          monto: data.dataset.monto,
          fecha_emision: data.dataset.fecha_emision,
        });
        setView('edit');
      } else {
        Alert.alert('Error', data.message || 'Error al obtener el registro');
      }
    } catch (error) {
      console.error('Error al obtener el registro:', error);
      Alert.alert('Error', 'Ocurrió un error al obtener el registro');
    }
  };

  const handleClientChange = async (clientId) => {
    setForm({ ...form, id_cliente: clientId });

    try {
      const data = await fetchData('cliente', 'readOne', { id_cliente: clientId });
      if (data.status) {
        // Update form with client details if needed
      } else {
        Alert.alert('Error', data.message || 'Error al obtener los detalles del cliente');
      }
    } catch (error) {
      console.error('Error al obtener los detalles del cliente:', error);
      Alert.alert('Error', 'Error al obtener los detalles del cliente');
    }
  };

  const handleServiceChange = async (serviceId) => {
    setForm({ ...form, id_servicio: serviceId });

    try {
      const data = await fetchData('servicio', 'readOne', { id_servicio: serviceId });
      if (data.status) {
        // Update form with service details if needed
      } else {
        Alert.alert('Error', data.message || 'Error al obtener los detalles del servicio');
      }
    } catch (error) {
      console.error('Error al obtener los detalles del servicio:', error);
      Alert.alert('Error', 'Error al obtener los detalles del servicio');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'list':
        return (
          <View style={styles.listContainer}>
            <Text style={styles.texto}>Sujeto Excluido</Text>
            <Buttons textoBoton="Agregar usuario" accionBoton={() => setView('create')} />
            <FlatList
              data={usuarios}
              keyExtractor={item => item.id_factura.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.descripcion}</Text>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleEdit(item.id_factura)} style={styles.button}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id_factura)} style={styles.button}>
                      <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        );
      case 'create':
      case 'edit':
        return (
          <ScrollView contentContainerStyle={styles.formContainer}>
            <Text style={styles.texto}>{view === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</Text>
            <Input
              placeHolder='Descripción'
              setValor={form.descripcion}
              setTextChange={(text) => setForm({ ...form, descripcion: text })}
            />
            <ComboBox
              placeHolder='Tipo Servicio'
              options={[
                { label: 'Credito Fiscal', value: 'Credito Fiscal' },
                { label: 'Factura Consumidor Final', value: 'Factura Consumidor Final' },
                { label: 'Factura Sujeto Excluido', value: 'Factura Sujeto Excluido' },
                { label: 'Otro', value: 'Otro' },
              ]}
              selectedValue={form.tipo_servicio}
              onValueChange={(value) => setForm({ ...form, tipo_servicio: value })}
            />
                          <ComboBox
                placeHolder='Servicio'
                options={servicios.map(service => ({
                  label: service.nombre_servicio, // Asegúrate de que 'nombre_servicio' es el campo correcto
                  value: service.id_servicio
                }))}
                selectedValue={form.id_servicio}
                onValueChange={(value) => handleServiceChange(value)}
              />
            <ComboBox
              placeHolder='Cliente'
              options={clientes.map(client => ({
                label: client.nombre_cliente, // Asegúrate de que 'nombre_cliente' es el campo correcto
                value: client.id_cliente
              }))}
              selectedValue={form.id_cliente}
              onValueChange={(value) => handleClientChange(value)}
            />
            <Input
              placeHolder='Monto'
              setValor={form.monto}
              setTextChange={(text) => setForm({ ...form, monto: text })}
              keyboardType='numeric'
            />
            <Input
              placeHolder='Fecha Emisión'
              setValor={form.fecha_emision}
              setTextChange={(text) => setForm({ ...form, fecha_emision: text })}
              keyboardType='datetime'
            />
            <Buttons textoBoton={view === 'create' ? 'Crear' : 'Actualizar'} accionBoton={view === 'create' ? handleCreate : handleUpdate} />
            <Buttons textoBoton="Cancelar" accionBoton={() => setView('list')} />
          </ScrollView>
        );
      default:
        return <View><Text>Vista no encontrada</Text></View>;
    }
  };

  return (
    <View style={styles.container}>
      {renderView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  texto: {
    fontSize: 20,
    marginBottom: 20,
  },
  itemContainer: {
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;

