async function fetchCards() {
  const response = await fetch('cards.json');
  const data = await response.json();
  console.log('Ho scaricato il db', data.cards);
  return data.cards;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  console.log('Ho mescolato', array);
  return array;
}

function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.dataset.id = card.id;

  const img = document.createElement('img');
  img.src = card.image;
  cardElement.appendChild(img);

  cardElement.addEventListener('click', () => {
    if (
      cardElement.classList.contains('flipped') ||
      cardElement.classList.contains('matched')
    )
      return;
    cardElement.classList.add('flipped');
    checkMatch();
  });

  return cardElement;
}

let flippedCards = [];
function checkMatch() {
  flippedCards = document.querySelectorAll('.card.flipped:not(.matched)');
  console.log('Flipped Cards:', flippedCards);
  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.id === second.dataset.id) {
      first.classList.add('matched');
      console.log('aggiungo matched alla card 1', first);
      second.classList.add('matched');
      console.log('aggiungo matched alla card 2', second);

      checkWin(); // Verifica se il gioco è finito
    } else {
      console.log('Non corrispondono');
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
      }, 1000);
    }
  }
}

function checkWin() {
  const matchedCards = document.querySelectorAll('.card.matched');
  const totalCards = document.querySelectorAll('.card').length;
  if (matchedCards.length === totalCards) {
    document.getElementById('win-message').style.display = 'block'; // Mostra il messaggio di vittoria
    document.getElementById('restart-button').style.display = 'block'; // Mostra il pulsante di riavvio
  }
}

async function initializeGame() {
  const cards = await fetchCards();
  const shuffledCards = shuffle(cards);
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  shuffledCards.forEach((card) => {
    const cardElement = createCardElement(card);
    gameBoard.appendChild(cardElement);
  });

  // Nascondi il messaggio di vittoria e il pulsante di riavvio
  document.getElementById('win-message').style.display = 'none';
  document.getElementById('restart-button').style.display = 'none';
}

document.getElementById('restart-button').addEventListener('click', () => {
  initializeGame(); // Riavvia il gioco
});

initializeGame();
