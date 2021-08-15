import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text,View } from 'react-native';

var { width } = Dimensions.get('window');

const CardBox = (props) => {
    return (
        <View style={[styles.container,props.styles]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 10,
        marginLeft: 5, 
        marginRight: 5, 
        marginBottom: 3, 
        marginTop:3,
        borderRadius:5,
        flexDirection:"column"
    },
    
})

export default CardBox;