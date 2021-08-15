import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from 'react-native'

const Label = (props) => {
    const [styles,setStyles] = useState({color:"grey",fontSize:14});
    const [isLoaded,setLoaded] = useState(true);

    const applyStyles = async (type)  => { 
        //console.log('Label,applyStyles',type);
        if(type == "form"){
            //setStyles({...styles,color:"red"});
        }
    }

    useEffect(()=>{
        //console.log('Label,useEffect');
        
        applyStyles(props.type);
        
        return ()=>{
        }

    })
    return (
        <>{isLoaded && <Text style={[styles,props.styles]}>{props.text}</Text>}</>
    )
}

export default Label;