import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
export default function App() {

  const [cards, setCards] = useState(
    [
      { id: 0, url: null },
      { id: 1, url: require('./assets/Marge.jpeg') },
      { id: 2, url: require('./assets/Mike.png') },
      { id: 3, url: require('./assets/Roz.png') }
    ]
  )
  useEffect(() => {
    console.log("user deleted")
    if (cards.length > 1) { setSelectedId(cards[cards.length - 1].id) }
  }, [cards])

  const [selectedId, setSelectedId] = useState()

  const pan = useState(new Animated.ValueXY())[0];
  let cardsAfterSwipe = cards.slice()
  const resetCards = () => {
    if (cardsAfterSwipe.length > 0) {
      cardsAfterSwipe.pop()
      setCards(cardsAfterSwipe)
      setSelectedId(cardsAfterSwipe[cardsAfterSwipe.length - 1].id)
    }
    pan.flattenOffset()
    pan.x.setValue(0)
    pan.x.setValue(0)
  }
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
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.moveX < windowWidth / 7) {
          console.log("move out left:")
          Animated.spring(
            pan,
            {
              toValue: { x: -600, y: 0 },
              useNativeDriver: false,
            },
          ).start(() => {
            resetCards()
          });
        } else if (gesture.moveX > windowWidth - windowWidth / 7) {
          console.log("move out right:", pan.x)
          Animated.spring(
            pan,
            {
              toValue: { x: 600, y: 0 },
              useNativeDriver: false,
            }
          ).start(() => {
            resetCards()
          });
        }else {
          console.log('move to zero')
          Animated.spring(
            pan,
            {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }
          ).start();
        }
      }
    })
  )[0];





  const renderCards = cards.map((item, index) => {

    if (item.url == null) return (
      <Text>We have no more cards</Text>
    )
    if (item.id === selectedId)
      return (
        <Animated.View
          style={{
            position: 'absolute', transform: [
              { translateX: pan.x },
              // { translateY: pan.y },
              {
                rotate: pan.x.interpolate({
                  inputRange: [-windowWidth / 2, 0, windowWidth / 2],
                  outputRange: ['-10deg', '0deg', '10deg'],
                  extrapolate: 'clamp'
                })
              }
            ]
          }}
          {...panResponder.panHandlers}
        >
          <Image key={index} source={item.url}
            style={styles.card} />
        </Animated.View>
      )
    else return (
      <Animated.View
        style={{
          position: 'absolute'
        }}>
        <Image key={index} source={item.url}
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

