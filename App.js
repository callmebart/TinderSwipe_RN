import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
export default function App() {
  useEffect(() => {
    if (cards.length > 1) { setSelectedId(cards[cards.length - 1].id) }
    if (cards.length > 2) setNextCardId(cards[cards.length - 2].id)
  }, [])

  const [cards, setCards] = useState(
    [
      { id: 0, url: null, text: 'We have no more cards' },
      { id: 1, url: require('./assets/Marge.jpeg'),name:'Marge',age:'34',desc:'fulfilled and happy mother'},
      { id: 2, url: require('./assets/Mike.png'),name:'Mike',age:'100',desc:'i really like kids'},
      { id: 3, url: require('./assets/Roz.png') ,name:'Roz',age:'60',desc:'vigorous accountant'}
    ]
  )
  const buttons = [
    { id: 0, url: require('./assets/reload.png') },
    { id: 1, url: require('./assets/x.png') },
    { id: 2, url: require('./assets/star.png') },
    { id: 3, url: require('./assets/heart.png') },
    { id: 4, url: require('./assets/strike.png') },
  ]
  let cardsAfterSwipe = cards.slice()
  const [selectedId, setSelectedId] = useState()
  const [nextCardId, setNextCardId] = useState()
  const pan = useState(new Animated.ValueXY())[0];
  const opacityLike = useState(new Animated.Value(0))[0]
  const opacityNope = useState(new Animated.Value(0))[0]

  const resetCards = () => {
    if (cardsAfterSwipe.length > 0) {
      cardsAfterSwipe.pop()
      setCards(cardsAfterSwipe)
      setSelectedId(cardsAfterSwipe[cardsAfterSwipe.length - 1].id)
      if (cardsAfterSwipe.length > 2)
        setNextCardId(cardsAfterSwipe[cardsAfterSwipe.length - 2].id)
    }
    pan.flattenOffset()
    pan.x.setValue(0)
    pan.x.setValue(0)
  }

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        })
      },
      onPanResponderMove: (_, gesture) => {
        pan.x.setValue(gesture.dx),
          pan.y.setValue(gesture.dy)
        if (gesture.dx < 0) {
          fadeOutLike(opacityNope)
          fadeInLike(opacityLike)
        }
        else {
          fadeOutLike(opacityLike)
          fadeInLike(opacityNope)
        }
      },
      onPanResponderRelease: (e, gesture) => {
        fadeOutLike(opacityLike)
        fadeOutLike(opacityNope)
        //MOVE OUT LEFT -> LIKE
        if (gesture.moveX < windowWidth / 7) {
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
          //MOVE OUT RIGHT -> NOPE
          Animated.spring(
            pan,
            {
              toValue: { x: 600, y: 0 },
              useNativeDriver: false,
            }
          ).start(() => {
            resetCards()
          });
        } else {
          //MOVE TO DEFAULT POSSITION
          fadeOutLike(opacityLike)
          fadeOutLike(opacityNope)
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


  const fadeInLike = (opacity) => {
    Animated.timing(opacity, {
      toValue: 0.6,
      duration: 50,
      useNativeDriver: false,
    }).start()
  }

  const fadeOutLike = (opacity) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 50,
      useNativeDriver: false,
    }).start()
  }

  const nextCardOpacity = useState(new Animated.Value(0))[0]
  Animated.timing(nextCardOpacity, {
    toValue: pan.x.interpolate({
      inputRange: [-windowWidth / 2, 0, windowWidth / 2],
      outputRange: [1, 0, 1],
    }),
    duration: 50,
    useNativeDriver: false,
  }).start()


  const renderCards = cards.map((item) => {

    if (item.url == null && (selectedId === 1 || selectedId === 0)) return (
      <Text key={item.id} style={{marginTop:windowHeight/2-100,left:100}}>{item.text}</Text>
    )

    if (item.id === selectedId)
      return (
        <Animated.View
          style={{
            zIndex: 1, position: 'absolute',width:windowWidth, transform: [
              { translateX: pan.x },
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
          key={item.id}
        >
          <Animated.View style={{ ...styles.like, opacity: opacityLike }}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#03fc98', }}>Like</Text>
          </Animated.View>
          <Animated.View style={{ ...styles.nope, opacity: opacityNope }}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#e60000', }}>Nope</Text>
          </Animated.View>

          <Text style={styles.cardHeader}>{item.name}, {item.age}</Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>

          <Image source={item.url}
            style={styles.card} />
            
        </Animated.View>
      )
    else if (item.id === nextCardId) return (
      <Animated.View style={{ zIndex: 1, position: 'absolute', opacity: nextCardOpacity }}
        key={item.id}
      >
        <Image source={item.url}
          style={styles.card} />
      </Animated.View>
    )

  })

  const renderButtons = buttons.map((item)=>{
    return (
      <TouchableOpacity key={item.id} style={[styles.button,styles.shadowProp]}>
        <Image source={item.url} />
      </TouchableOpacity>
    )
  })

  return (
    <View style={styles.container}>
      <View style={{flex:1}}></View>
      <View style={{flex:8}}>
      {renderCards}
      </View>
     
      <View style={styles.buttonsView}> 
          {renderButtons}
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f7f6',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  card: {
    flex:6,
    width: windowWidth - 20,
    height: windowHeight - 200,
    borderRadius: 15,
    marginLeft:10
  },
  like: {
    position: 'absolute',
    zIndex: 1000,
    left: 50,
    top: 200,
    borderRadius: 5,
    borderColor: '#03fc98',
    borderWidth: 5,
    paddingVertical: 5,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignContent: 'center',
    transform: [{ rotate: '-40deg' }],
  },
  nope: {
    position: 'absolute',
    zIndex: 1000,
    right: 50,
    top: 200,
    borderRadius: 5,
    borderColor: '#e60000',
    borderWidth: 5,
    paddingVertical: 5,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignContent: 'center',
    transform: [{ rotate: '40deg' }],
  },
  button:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',   
  },
  buttonsView:{
    flex:2,flexDirection:'row',
    justifyContent:'space-between',
    marginTop:40,
    marginHorizontal:10
  },
  shadowProp: {
    shadowColor: 'grey',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 70,
    elevation: 3,
  },
  cardHeader:{
    position:'absolute',
    zIndex:2,
    bottom:40,
    color:'white',
    fontSize:40,
    fontFamily: 'normal',
    marginLeft:30
  },
  cardDesc:{
    position:'absolute',
    zIndex:2,
    bottom:20,
    color:'white',
    fontSize:20,
    fontFamily: 'normal',
    marginLeft:30
  },
});

