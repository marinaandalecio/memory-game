import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import { shuffle } from "lodash";

const images = [
  require("./assets/images/biblioteca-central-1.jpg"),
  require("./assets/images/eba.jpg"),
  require("./assets/images/eci.jpg"),
  require("./assets/images/educacao-fisica.jpg"),
  require("./assets/images/engenharia.jpg"),
  require("./assets/images/face.jpg"),
  require("./assets/images/fafich.jpg"),
  require("./assets/images/fale.jpg"),
  require("./assets/images/farmacia.jpg"),
  require("./assets/images/icb.jpg"),
  require("./assets/images/icex-1.jpg"),
  require("./assets/images/medicina.jpg"),
  require("./assets/images/musica.jpg"),
  require("./assets/images/odontologia.jpg"),
  require("./assets/images/praca-de-servico.jpg"),
  require("./assets/images/veterinaria-2.jpg"),
];

const baseImg = require("./assets/images/base_image.jpg");

const App = () => {
  // Estado de setup do jogo
  const [numberOfImages, setNumberOfImages] = useState(8); // Default de 8 imagens (16 cartas)
  const [cardSize, setCardSize] = useState(125); // Tamanho padrão 125
  const [gameStarted, setGameStarted] = useState(false); // Variável de controle de estado do jogo (setup / jogando)

  // Variáveis do jogo
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [tries, setTries] = useState(0); // Número de tentativas
  const totalPairs = numberOfImages;

  // Função para inicialização do jogo
  const initializeGame = () => {
    // Reinicia array de cartas
    setCards([]);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setTries(0);
    const selectedImages = images.slice(0, numberOfImages); // Separa o array de imagens no número de imagens definido pelo usuário
    const pairedImages = [...selectedImages, ...selectedImages]; // Duplica o array de imagens
    const shuffledCards = shuffle(
      pairedImages.map((img, index) => ({
        img,
        id: index,
        flipped: false,
        matched: false,
      }))
    );
    // Define novo array de cartas
    setCards(shuffledCards);
  };

  // Muda estado do jogo para ativo e inicializa jogo

  const startGame = () => {
    initializeGame();
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted) initializeGame();
  }, [gameStarted]);

  // Vira as cartas
  const flipCard = (index) => {
    if (
      cards[index].flipped ||
      cards[index].matched ||
      flippedIndices.length === 2
    )
      return;

    setCards((prevCards) =>
      prevCards.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      )
    );
    setFlippedIndices((prev) => [...prev, index]);
  };

  // Confere acerto e incrementa tentativas
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setTries((prev) => prev + 1);

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
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, flipped: card.matched }
              : card
          )
        );
        setFlippedIndices([]);
      }, 1000);
    }
  }, [flippedIndices]);

  // Renderiza as cartas
  const renderCard = (card, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => flipCard(index)}>
        <View style={[styles.card, { width: cardSize, height: cardSize }]}>
          {card.matched ? (
            <Image
              source={card.img}
              style={{
                width: cardSize - 10,
                height: cardSize - 10,
                opacity: 0.3,
              }}
            />
          ) : card.flipped ? (
            <Image
              source={card.img}
              style={{ width: cardSize - 10, height: cardSize - 10 }}
            />
          ) : (
            <Image
              source={baseImg}
              style={{ width: cardSize - 10, height: cardSize - 10, resizeMode: 'contain' }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Prompt de vitória
  useEffect(() => {
    if (matchedPairs === totalPairs) {
      Alert.alert("Parabéns!", "Você ganhou o jogo!", [
        {
          text: "Iniciar novo jogo",
          onPress: initializeGame,
        },
      ]);
    }
  }, [matchedPairs]);

  // Condicional para setup do jogo
  if (!gameStarted) {
    return (
      <View style={styles.setupScreen}>
        <Text style={styles.setupTitle}>Configure o jogo</Text>

        <Text style={styles.setupText}>Selecione o número de imagens:</Text>
        <Picker
          selectedValue={numberOfImages}
          style={styles.picker}
          onValueChange={(itemValue) => setNumberOfImages(itemValue)}
        >
          {[4, 6, 8, 10, 12, 14, 16].map((num) => (
            <Picker.Item key={num} label={`${num}`} value={num} />
          ))}
        </Picker>

        <Text style={styles.setupText}>Selecione o tamanho das cartas:</Text>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={150}
          step={5}
          value={cardSize}
          onValueChange={(value) => setCardSize(value)}
        />
        <Text>Tamanho da carta:</Text>
        {/* Carta dinâmica para demonstrar tamanho durante o jogo */}
        <View style={styles.imagePreviewContainer}>
          <Image
            source={images[0]} // Primeira imagem como preview
            style={{ width: cardSize, height: cardSize }}
          />
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => startGame()}
        >
          <Text style={styles.startButtonText}>Iniciar o jogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Retorna jogo em andamento, caso setup completo
  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Pares completos: {matchedPairs}/{totalPairs}
        </Text>
        <Text style={styles.statusText}>Tentativas: {tries}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.mainView}
        bounces={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.grid}>
          {cards.map((card, index) => renderCard(card, index))}
        </View>
        <TouchableOpacity onPress={() => setGameStarted(false)}>
          <Text style={styles.restartGame}>Redefinir configuração</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  statusBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#333",
    zIndex: -1,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
  },
  mainView: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  grid: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    justifyContent: "space-around",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
  cardText: {
    fontSize: 24,
  },
  setupScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  setupTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  setupText: {
    fontSize: 18,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  slider: {
    width: 200,
    height: 40,
  },
  startButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  restartGame: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#00FF7B",
    borderRadius: 5,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
