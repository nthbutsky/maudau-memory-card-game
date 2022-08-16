<template>
  <div class="game">
    <div class="game__dashboard">
      <div class="game__turns-wrapper">
        <span class="game__turns">Turns :
          <span
            class="game__badge"
            :class="isFinished ?
              'game__badge_success' :
              'game__badge_light'"
          >{{ turns }}</span>
        </span>
      </div>
      <div class="game__time-wrapper">
        <span class="game__time">Total Time :
          <span
            class="game__badge"
            :class="isFinished ?
              'game__badge_success' :
              'game__badge_light'"
          >{{ time.min() }} : {{ time.sec() }}
          </span>
        </span>
      </div>
      <div class="game__reset-button-wrapper">
        <button
          class="game__reset-button"
          :disabled="!isStarted"
          @click="resetGame"
        >
          Restart
        </button>
      </div>
    </div>
    <div class="game__container">
      <div
        v-for="card in cardList"
        :key="card.id"
        class="game__card"
        :data-identifier="card.dataIdentifier"
        :class="{
          'game__card-flip': card.isFlipped,
        }"
        @click="isLocked ? null : flipCard(card)"
      >
        <img
          class="game__card-front"
          :src="'/image/' + card.name + '.png'"
          alt=""
        >
        <img
          class="game__card-back"
          src="@/assets/logo/short-green.svg"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted, ref, computed,
} from 'vue';

const INTERVAL = 1000;

const cardList = ref();
const disabledCardPairsCount = ref(0);
const isFlipped = ref(false);
const isLocked = ref(false);
const firstCard = ref();
const secondCard = ref();
const isStarted = ref(false);
const isFinished = ref(false);
const turns = ref(0);
const totalTime = ref({
  min: 0,
  sec: 0,
});
let timerId = null as null | ReturnType<typeof setTimeout>;

const imageArray = Object.keys(import.meta.glob('@/assets/image/*.png'));

const time = computed(() => {
  return {
    sec() {
      if (totalTime.value.sec < 10) {
        return `0${totalTime.value.sec}`;
      }
      return totalTime.value.sec;
    },
    min() {
      if (totalTime.value.min < 10) {
        return `0${totalTime.value.min}`;
      }
      return totalTime.value.min;
    },
  };
});

function tick() {
  if (totalTime.value.sec !== 59) {
    totalTime.value.sec += 1;
    return;
  }

  totalTime.value.min += 1;
  totalTime.value.sec = 0;
}

function startGame() {
  tick();
  timerId = setInterval(tick, INTERVAL);
  isStarted.value = true;
}

function finishGame() {
  isFinished.value = true;
  isLocked.value = true;
  if (timerId) {
    clearInterval(timerId);
  }
}

function shuffleCards(array: any) {
  let currentIndex: number = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [
      // eslint-disable-next-line no-param-reassign
      array[currentIndex],
      // eslint-disable-next-line no-param-reassign
      array[randomIndex],
    ] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function createCardList() {
  const resultArray: {id: string, name: string, isFlipped: boolean, dataIdentifier: number}[] = [];
  for (let i = 0; i < 2; i += 1) {
    let index = 0;
    imageArray.forEach((element) => {
      const fileName = element.slice(-8, -4);
      resultArray.push({
        // eslint-disable-next-line no-restricted-globals
        id: self.crypto.randomUUID(),
        name: fileName,
        isFlipped: false,
        dataIdentifier: index,
      });
      index += 1;
    });
  }

  const shuffledArray = shuffleCards(resultArray);

  cardList.value = shuffledArray;
}

function resetCards() {
  isFlipped.value = false;
  isLocked.value = false;
  firstCard.value = null;
  secondCard.value = null;
}

function resetGame() {
  if (timerId) {
    clearInterval(timerId);
  }
  createCardList();
  resetCards();
  turns.value = 0;
  totalTime.value.sec = 0;
  totalTime.value.min = 0;
}

function unflipCards() {
  isLocked.value = true;

  setTimeout(() => {
    cardList.value.forEach((item: any) => {
      if (item.id === firstCard.value.id) {
        item.isFlipped = false;
      }
      if (item.id === secondCard.value.id) {
        item.isFlipped = false;
      }
    });

    resetCards();
  }, 500);
}

function flipCard(card: any) {
  if (!isStarted.value) {
    startGame();
  }

  cardList.value.forEach((item: any) => {
    if (item.id === card.id) {
      item.isFlipped = true;
    }
  });

  if (isLocked.value) {
    return;
  }

  if (card === firstCard.value) {
    return;
  }

  // first click
  if (!isFlipped.value) {
    isFlipped.value = true;
    firstCard.value = card;

    return;
  }

  // second click
  secondCard.value = card;
  turns.value += 1;

  const isMatch = firstCard.value.dataIdentifier === secondCard.value.dataIdentifier;
  if (isMatch) {
    isLocked.value = true;
    disabledCardPairsCount.value += 1;
    resetCards();

    if (disabledCardPairsCount.value === 18) {
      finishGame();
    }
  } else {
    unflipCards();
  }
}

onMounted(() => {
  createCardList();
});

</script>

<style lang="scss" scoped>
@use './game.scss'
</style>
