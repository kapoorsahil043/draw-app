import React from "react"
import { StyleSheet, View, Text, Dimensions } from 'react-native'
var { height } = Dimensions.get("window");

const DefaultMessage = (props) => {
    return (
        <View style={[styles.center, { height: height / 2 }]}>
                <Text style={styles.text}>No draws available at the moment!!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center",
      },
    text: {
        color: 'black',
        fontSize:12
    }
})

export default DefaultMessage;