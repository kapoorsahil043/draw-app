import React, { useState } from "react"
import { StyleSheet, View, Text, Dimensions } from 'react-native'
var { height } = Dimensions.get("window");

const DefaultMessage = (props) => {
    const [message] = useState("No draws available at the moment!!");
    return (
        <View style={[styles.center, { height: height / 2 }]}>
                <Text style={styles.text}>{props.message || message}</Text>
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