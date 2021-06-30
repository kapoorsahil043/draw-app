import React, {useState} from "react"
import { StyleSheet, View, Text, Image } from 'react-native'

const RankTable = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  let cnt = 0;
  return (
      <View>
        {/* headers */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "space-around",
            padding: 10,
            backgroundColor: "#E8E8E8",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Rank</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Price</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Type</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Image</Text>
          </View>
        </View>

        {/* body */}
        {
          item && item.ranks.map((item) => {
            ++cnt;
            return (
              <View
                key={item.rankStart}
                style={{
                  flexDirection: "row",
                  padding: 10,
                  backgroundColor: cnt % 2 == 0 ?  '#E8E8E8': '',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>
                    {item.rankStart == item.rankEnd
                      ? "#" + item.rankStart
                      : "#" + item.rankStart + " - " + item.rankEnd}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.rankPrice}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.rankType}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Image
                    style={{ height: 40, width: 40, borderRadius: 100 }}
                    source={{ uri: item.rankImage }}
                  />
                </View>
              </View>
            );
          })}
      </View>
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
    }
})

export default RankTable;