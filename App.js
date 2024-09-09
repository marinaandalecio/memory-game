import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { shuffle } from "lodash";

const images = [
  require("./assets/images/biblioteca-central-1.jpg"),
  require("./assets/images/eba.jpg"),
  require("./assets/images/educacao-fisica.jpg"),
  require("./assets/images/engenharia.jpg"),
  require("./assets/images/face.jpg"),
  require("./assets/images/fafich.jpg"),
  require("./assets/images/farmacia.jpg"),
  require("./assets/images/icb.jpg"),
  require("./assets/images/icex-1.jpg"),
  require("./assets/images/musica.jpg"),
  require("./assets/images/odontologia.jpg"),
  require("./assets/images/veterinaria-2.jpg"),
];

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const initializeGame = () => {
    const pairedImages = [...images, ...images];
    const shuffledCards = shuffle(
      pairedImages.map((img, index) => ({
        img,
        id: index,
        flipped: false,
        matched: false,
      }))
    );
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].img === cards[secondIndex].img) {
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, matched: true }
              : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
      }
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: false }))
        );
        setFlippedIndices([]);
      }, 1000);
    }
  }, [flippedIndices]);

  const handleCardPress = (index) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].flipped ||
      cards[index].matched
    )
      return;

    setCards((prevCards) =>
      prevCards.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      )
    );
    setFlippedIndices((prev) => [...prev, index]);
  };

  const renderCard = (card, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        card.flipped || card.matched ? styles.cardFlipped : styles.cardHidden,
      ]}
      onPress={() => handleCardPress(index)}
    >
      {card.matched ? (
        <Image source={card.img} style={styles.matchedCardImage} />
      ) : card.flipped ? (
        <Image source={card.img} style={styles.cardImage} />
      ) : (
        <Text style={styles.cardText}>?</Text>
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    if (matchedPairs === images.length) {
      Alert.alert("Parabéns!", "Você ganhou o jogo!", [
        {
          text: "Obrigado(a)! Iniciar novo jogo",
          onPress: initializeGame,
        },
      ]);
    }
  }, [matchedPairs]);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
    >
      <View style={styles.grid}>
        {cards.map((card, index) => renderCard(card, index))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    justifyContent: "space-around",
  },
  card: {
    width: 85,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
  cardFlipped: {
    backgroundColor: "white",
  },
  cardHidden: {
    backgroundColor: "#eee",
  },
  cardImage: {
    width: 80,
    height: 75,
  },
  matchedCardImage: {
    width: 80,
    height: 70,
    opacity: 0.3,
  },
  cardText: {
    fontSize: 24,
  },
});

export default App;
