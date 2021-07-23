import React, {useState} from "react"
import { StyleSheet, View, Text, Image,SafeAreaView,FlatList } from 'react-native'
import * as constants from '../assets/common/constants';
import appstyles from "../assets/common/appstyles";
import Spinner from "./Spinner";

const RankTable = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [loading,setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const loadMoreResults = async info => {
    console.log('loadMoreResults',info)
  }
  
  return (

    <SafeAreaView>
      <Spinner status={loading}/>
      <FlatList
        contentContainerStyle={appstyles.list}
        ListHeaderComponent={
        <View style={{ flex: 1, flexDirection: "row", alignContent: "space-around", padding: 10, backgroundColor: "#E8E8E8",}}>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>#Rank</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>*Amount</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>Name</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>Price</Text>
          </View>
        </View>
        }
        ListFooterComponent={
          <View style={appstyles.footer}>
            {loadingMore &&
              <Text style={appstyles.footerText}>loading...</Text>
            }
          </View>
        }
        scrollEventThrottle={250}
        onEndReached={info => {
          loadMoreResults(info);
        }}
        onEndReachedThreshold={0.01}
        data={item.ranks}
        keyExtractor={(item) => "item_" + item._id}
        renderItem={({ item, index }) => {
          return (
            <React.Fragment key={index}>
              <View key={item.rankStart} style={{   flexDirection: "row",   height: 70,   backgroundColor: index % 2 == 0 ?  '#E8E8E8': '',alignItems:"center",padding: 10, }} >
                <View style={{ flex: 1, }}>
                  <Text style={styles.textValue}> 
                    {item.rankStart == item.rankEnd ? "#" + item.rankStart : "#" + item.rankStart + " - " + item.rankEnd}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textValue}>{item.rankPrice}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textValue}>{item.rankType}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Image
                    style={{ height: 50, width: 50, borderRadius: 100 }}
                    source={{ uri: item.rankImage }}
                  />
                </View>
              </View>
            </React.Fragment>
          )
        }}
      />
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        margin: 10
    },
    text: {
        color: 'red'
    },
    textLabel:{
      color:"grey",fontSize:12
    },
    textValue:{
      fontSize:12,
      color:"black"
    }
})

export default RankTable;