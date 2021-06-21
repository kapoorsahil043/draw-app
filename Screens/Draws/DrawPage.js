import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Container,
  Header,
  Item,
  Input,
  Text,
  Button,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import DrawList from "./DrawList";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Icon from "react-native-vector-icons/FontAwesome";

var { height } = Dimensions.get("window");

const DrawPage = (props) => {
  const [draws, setDraws] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);
      // Draws
      setTimeout(() => {
        axios
          .get(`${baseURL}draws`)
          .then((res) => {
            setDraws(res.data);
            setInitialState(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Api call error");
          });
      }, 10);

      return () => {
        setDraws([]);
        setFocus();
        setActive();
        setInitialState();
      };
    }, [])
  );

  // Product Methods
  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category._id === ctg),
              setActive(true)
            ),
          ];
    }
  };

  const edit = (item) => {
    console.log("edit", item);
  };

  return (
    <>
      <Container>
        <ScrollView>
          <View style={{backgroundColor:"lightgrey",marginTop:10,marginBottom:20}}>
            <EasyButton large primary onPress={() => props.navigation.navigate("Add",{item:null})}>
              <Text style={styles.buttonText}><Icon name="plus" size={15} />&nbsp;Add Draw</Text>
            </EasyButton>
          </View>

          <View>
            {draws.length > 0 ? (
              <View style={styles.listContainer}>
                {draws.map((item) => {
                  return (
                    <DrawList
                      navigation={props.navigation}
                      key={item.id}
                      item={item}
                      join={edit}
                      
                    />
                  );
                })}
              </View>
            ) : (
              <View style={[styles.center, { height: height / 2 }]}>
                <Text>No draws available at the moment!!</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
    paddingBottom: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
    margin: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
});


export default DrawPage;
