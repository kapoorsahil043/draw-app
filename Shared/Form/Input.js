import React from 'react';
import { TextInput, StyleSheet } from 'react-native'

const Input = (props) => {
    return (
        <TextInput
        style={styles.input}
        placeholder={props.placeholder}
        name={props.name}
        id={props.id}
        value={props.value}
        autoCorrect={props.autoCorrect}
        onChangeText={props.onChangeText}
        onFocus={props.onFocus}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        multiline={props.multiline || false}
        >
        </TextInput>
    );
}

const styles = StyleSheet.create({
    input: {
        width: '80%',
        height: 50,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'red'
    },
});

export default Input;