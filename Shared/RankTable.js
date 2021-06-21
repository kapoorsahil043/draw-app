import React from "react"
import { StyleSheet, View, Text, Image } from 'react-native'

const RankTable = (props) => {
    const { item } = props;

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
        <View
          style={{
            backgroundColor: "#F5F5F5",
            padding: 10,
            marginBottom: 10,
          }}
        >
          {item && item.ranks.map((item) => {
            return (
              <View
                key={item.rankStart}
                style={{
                  flexDirection: "row",
                  paddingBottom: 5,
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
                    style={{ height: 50, width: 50, borderRadius: 100 }}
                    source={{ uri: item.rankImage }}
                  />
                </View>
              </View>
            );
          })}
        </View>
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