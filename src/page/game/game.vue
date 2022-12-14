<template>
  <div class="game">
    <div
      class="game__dashboard"
    >
      <div class="game__turns-wrapper">
        <span
          class="game__turns"
          :class="{'game__turns_finish': !isGameStarted && disabledCardPairsCount === NUMBER_OF_PAIRS}"
        >
          Turns: {{ turns }}
        </span>
      </div>
      <div class="game__time-wrapper">
        <span
          class="game__time"
          :class="{'game__time_finish': !isGameStarted && disabledCardPairsCount === NUMBER_OF_PAIRS}"
        >
          Time: {{ time.min() }} : {{ time.sec() }}
        </span>
      </div>
      <div
        v-if="!isGameStarted && disabledCardPairsCount === NUMBER_OF_PAIRS"
        class="game__reset-button-wrapper"
      >
        <button
          class="game__reset-button"
          @click="resetGame"
        >
          Restart
        </button>
      </div>
    </div>
    <div class="game__confetti-wrapper">
      <confetti-explosion
        v-if="!isGameStarted && disabledCardPairsCount === NUMBER_OF_PAIRS"
        class="game__confetti"
        :stage-height="1000"
        :particle-count="200"
        :force="0.3"
        :colors="['#371F5E',
                  '#A4FFB8',
                  '#FFFFFF',
                  '#91C4F2',
                  '#8CA0D7',
                  '#9D79BC']"
      />
    </div>
    <div class="game__container">
      <div
        v-for="card in cardList"
        :key="card.id"
        class="game__card"
        :class="{
          'game__card_flip': card.isFlipped,
        }"
        @click="card.isFlipped && card.isGuessed ? null : flipCard(card)"
      >
        <img
          class="game__card-front"
          :src="getImageUrl(card.name)"
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
  onMounted, ref, computed, onBeforeUnmount,
} from 'vue';
import ConfettiExplosion from 'vue-confetti-explosion';

const INTERVAL = 1000;
const NUMBER_OF_CARDS = 16;
const NUMBER_OF_PAIRS = NUMBER_OF_CARDS / 2;

const cardList = ref();
const disabledCardPairsCount = ref(0);
const isFlipped = ref(false);
const isLocked = ref(false);
const firstCard = ref();
const secondCard = ref();
const isGameStarted = ref(false);
const turns = ref(0);
const totalTime = ref({
  min: 0,
  sec: 0,
});
let timerId = null as null | ReturnType<typeof setTimeout>;

const imageArray = computed(() => {
  return Object.keys(import.meta.glob('@/assets/image/*.png'));
});

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
  isGameStarted.value = true;
}

function finishGame() {
  isGameStarted.value = false;
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
  const resultArray: {id: string, name: string, isFlipped: boolean, isGuessed: boolean}[] = [];
  imageArray.value.forEach((element) => {
    const fileName = element.slice(-8, -4);
    resultArray.push({
      id: '',
      name: fileName,
      isFlipped: false,
      isGuessed: false,
    });
  });

  const shuffledArray = shuffleCards(resultArray);
  const slicedArray = shuffledArray.slice(-NUMBER_OF_PAIRS);
  const slicedArrayClone = JSON.parse(JSON.stringify(slicedArray));
  const mergedArray = [
    ...slicedArray,
    ...slicedArrayClone,
  ];

  mergedArray.forEach((element) => {
    // eslint-disable-next-line no-restricted-globals
    element.id = self.crypto.randomUUID();
  });

  cardList.value = mergedArray;
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
  isGameStarted.value = false;
  disabledCardPairsCount.value = 0;
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
  if (!isGameStarted.value) {
    startGame();
  }

  if (isLocked.value) {
    return;
  }

  if (card === firstCard.value) {
    return;
  }

  cardList.value.forEach((item: any) => {
    if (item.id === card.id) {
      item.isFlipped = true;
    }
  });

  // first click
  if (!isFlipped.value) {
    isFlipped.value = true;
    firstCard.value = card;

    return;
  }

  // second click
  secondCard.value = card;
  turns.value += 1;

  const isMatch = firstCard.value.name === secondCard.value.name;
  if (isMatch) {
    isLocked.value = true;
    disabledCardPairsCount.value += 1;
    cardList.value.forEach((item: any) => {
      if (item.id === firstCard.value.id) {
        item.isGuessed = true;
        item.isFlipped = true;
      }
      if (item.id === secondCard.value.id) {
        item.isGuessed = true;
        item.isFlipped = true;
      }
    });
    resetCards();

    if (disabledCardPairsCount.value === NUMBER_OF_PAIRS) {
      finishGame();
    }
  } else {
    unflipCards();
  }
}

function getImageUrl(name: string) {
  return new URL(`/src/assets/image/${name}.png`, import.meta.url).href;
}

onMounted(() => {
  createCardList();
});

onBeforeUnmount(() => {
  if (timerId) {
    clearTimeout(timerId);
  }
});

</script>

<style lang="scss" scoped>
@use './game.scss';
@use '@/style/constant/color.scss';
</style>
