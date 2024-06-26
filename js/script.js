import playList from './playList.js';
import quotes from './quotes.js';
const time = document.querySelector('.time')
const currentDate = document.querySelector('.date')
const greeting = document.querySelector('.greeting')
const name = document.querySelector('.name')
const slideNext = document.querySelector('.slide-next')
const slidePrev = document.querySelector('.slide-prev')
let randomNum = getRandomNum(1, 20)

function showTime() {
    const date = new Date()
    const currentTime = date.toLocaleTimeString()
    time.textContent = currentTime
    setTimeout(showTime, 1000)
    showDate()
    showGreeting()
}
showTime()

function showDate() {
    const date = new Date()
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentFuncDate = date.toLocaleDateString('en-US', options);
    currentDate.textContent = currentFuncDate
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    let timeOfTheDay;
    if (hours >= 5 && hours <= 12) {
        timeOfTheDay = 'morning';
    } else if (hours > 12 && hours < 17) {
        timeOfTheDay = 'afternoon';
    } else if (hours >= 17 && hours < 21) {
        timeOfTheDay = 'evening';
    } else {
        timeOfTheDay = 'night';
    }
    return(timeOfTheDay)
} 
getTimeOfDay()

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bgNum() {
    if (randomNum < 10) {
        randomNum = randomNum.toString().padStart(2, '0')
    } else {
        randomNum = randomNum.toString()
    }
}
bgNum()

function setBg() {
    const timeOfDay = getTimeOfDay();
    bgNum()
    let bgNumber = randomNum;
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNumber}.jpg`;
    img.onload = () => {      
        document.body.style.backgroundImage = `url('${img.src}')`;
    }; 
}
setBg()

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    const greetingText = `Good ${timeOfDay},`;
    greeting.textContent = greetingText
}

function setLocalStorage() {
    localStorage.setItem('name', name.value);
  }
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    const nameFromLS = localStorage.getItem('name');
    if (nameFromLS !== null) {
      name.value = nameFromLS;
    }
}
window.addEventListener('load', getLocalStorage)

function getInputValue() {
    var inputValue = name.value;
    return inputValue;
}
  
function handleKeyPress(event) {
    if (event.keyCode === 13) {
        var nameValue = getInputValue();
    }
} 
name.addEventListener('keypress', handleKeyPress);

// --------------------------->Slider<---------------------------

function getSlideNext() {
    randomNum ++;
    if (randomNum == 21) {
        randomNum = '01'
    }  
    setBg()
}

function getSlidePrev() {
    randomNum --;
    if (randomNum == 0) {
        randomNum = 20
    }    
    setBg()
}

slideNext.addEventListener('click', getSlideNext)
slidePrev.addEventListener('click', getSlidePrev)

// --------------------------->Weather<---------------------------

const city = document.querySelector('.city')
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind') 
const humidity = document.querySelector('.humidity')


function getCityLocalStorage() {
    const cityFromLS = localStorage.getItem('city');
    if (cityFromLS !== null) {
      city.value = cityFromLS;
    } 
    getWeather()
}
window.addEventListener('load', getCityLocalStorage)

async function getWeather() { 
    const cityName = city.value.trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&lang=en&appid=44697523e70dc5d8919715a75424c178&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind: ${data.wind.speed} km/h`
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
}

function setCityLocalStorage() {
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setCityLocalStorage)

function setCity(event) {
    if (event.code === 'Enter') {
      getWeather();
      city.blur();
    }
}
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);

// --------------------------->Quotes<---------------------------

const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const changeQuoteBtn = document.querySelector('.change-quote')
const icon = document.querySelector('.icon');

function getQuotes() {
    let num = getRandomNum(0, (quotes.length - 1))
    quote.style.opacity = '0';
    author.style.opacity = '0';
    setTimeout(() => {
        quote.textContent = quotes[num].text
        author.textContent = quotes[num].author
        quote.style.opacity = '1';
        author.style.opacity = '1';
    }, 500)
}
getQuotes()

changeQuoteBtn.addEventListener('click', () => {
    icon.classList.toggle('rotate-180');
    getQuotes()
})

// --------------------------->Audio Player<---------------------------

const playBtn = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const progressBar = document.querySelector('#progress-bar');
let isPlay = false;
let playNum = 0;
let currentTime = 0;
const audio = new Audio();

const createPlaylist = sound => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = sound.title;
  playListContainer.append(li);
};

const updatePlaylistUI = () => {
  playListContainer.querySelectorAll('.play-item').forEach((item, index) => {
    item.classList.toggle('playing', index === playNum);
  });
};

const updateProgressValue = () => {
  progressBar.max = audio.duration || 0;
  progressBar.value = audio.currentTime;
  document.querySelector('.currentTime').innerHTML = formatTime(Math.floor(audio.currentTime));
  document.querySelector('.durationTime').innerHTML = formatTime(Math.floor(audio.duration)) || '0:00';
};

const formatTime = seconds => {
  const min = Math.floor(seconds / 60);
  const sec = `0${Math.floor(seconds % 60)}`.slice(-2);
  return `${min}:${sec}`;
};

const loadAudio = () => {
  audio.src = playList[playNum].src;
  audio.currentTime = currentTime;
  if (isPlay) audio.play();
};

const togglePlay = () => {
  isPlay = !isPlay;
  playBtn.classList.toggle('pause', isPlay);
  if (isPlay) {
    loadAudio();
  } else {
    currentTime = audio.currentTime;
    audio.pause();
  }
};

const changeTrack = direction => {
  playNum = (playNum + direction + playList.length) % playList.length;
  currentTime = 0;
  updatePlaylistUI();
  loadAudio();
};

window.addEventListener('load', () => {
  playList.forEach(createPlaylist);
  updatePlaylistUI();
});

playBtn.addEventListener('click', togglePlay);
playNextBtn.addEventListener('click', () => changeTrack(1));
playPrevBtn.addEventListener('click', () => changeTrack(-1));
progressBar.addEventListener('input', () => {
  audio.currentTime = progressBar.value;
});

audio.addEventListener('timeupdate', updateProgressValue);
audio.addEventListener('loadedmetadata', updateProgressValue);
