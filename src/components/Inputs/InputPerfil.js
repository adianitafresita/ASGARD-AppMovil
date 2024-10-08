import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, Animated } from 'react-native';

export default function Input({ placeHolder, setValor, contra, setTextChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderColor, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderColor, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#828181', '#FFA500'] // Color de borde cambia a naranja
  });

  return (
    <Animated.View style={[styles.inputContainer, { borderColor: animatedBorderColor }]}>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]} // Cambiar el estilo del texto cuando está enfocado
        placeholder={placeHolder}
        value={setValor}
        placeholderTextColor={'#828181'}
        secureTextEntry={contra} // Mostrar texto como puntos para contraseñas
        onChangeText={setTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%', // Ajustar el ancho al contenedor padre
    borderRadius: 8,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 2
  },
  input: {
    backgroundColor: '#00000000',
    color: '#000',
    fontSize: 16,
  },
  inputFocused: {
    color: '#FFF' // Cambiar el color del texto a blanco cuando está enfocado
  }
});
