import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
export default function App() {

  const pan = useState(new Animated.ValueXY())[0];
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log("pan")
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        })
      },
      onPanResponderMove: (_, gesture) => {
        pan.x.setValue(gesture.dx),
          pan.y.setValue(gesture.dy)
        //console.log(pan.x, pan.y)
      },
      onPanResponderRelease: () => {
        pan.flattenOffset()
      }
    })
  )[0];

  const cards = [
    { id: 0, url: require('./assets/Marge.jpeg') },
    { id: 1, url: require('./assets/Mike.png') },
    { id: 2, url: require('./assets/Roz.png') }
  ]

  const selectedId = cards[cards.length - 1].id

  const renderCards = cards.map((item) => {

    if (item.id === selectedId)
      return (
        <Animated.View
          style={{
            position: 'absolute', transform: [
              { translateX: pan.x },
              // { translateY: pan.y },
              { rotate: pan.x.interpolate({
                inputRange:[-windowWidth/2,0,windowWidth/2],
                outputRange:['-10deg','0deg','10deg'],
                 extrapolate:'clamp'
              }) }
            ]
          }}
          {...panResponder.panHandlers}
        >
          <Image key={item.id} source={item.url}
            style={styles.card} />
        </Animated.View>
      )
    else return (
      <Animated.View
        style={{
          position: 'absolute'
        }}>
        <Image key={item.id} source={item.url}
          style={styles.card} />
      </Animated.View>
    )

  })

  return (
    <View style={styles.container}>
      {renderCards}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: windowWidth - 20,
    height: windowHeight - 150,
    borderRadius: 15,
  },
});

