import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text,View } from 'react-native';

var { width } = Dimensions.get('window');

const CardBox = (props) => {
    return (
        <View style={[{backgroundColor: "white",padding: 10, margin: 5, borderRadius:5,flexDirection:"column"},props.styles]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginBottom: 400,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
    }
})

export default CardBox;