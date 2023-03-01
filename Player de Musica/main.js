const cover = document.getElementById('cover');
const song = document.getElementById('audio');
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const currentProgress = document.getElementById('current-progress');
const play = document.getElementById('play');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const like = document.getElementById('like');
const repeat = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');


const BeSomeone = {
    songName: 'Be Someone',
    artist: 'KVSH',
    file: 'Be_Someone',
    like: false
}
const HorizonRed = {
    songName: 'Horizon Red',
    artist: 'Made By Pete & Zoe Kypri',
    file: 'Horizon_Red',
    like: true
}
const TempoDira = {
    songName: 'Tempo Dirá',
    artist: 'Kamau',
    file: 'Tempo_dira',
    like: false
}

const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [BeSomeone, HorizonRed, TempoDira];
let sortedPlaylist = originalPlaylist
let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === false){
        playSong();
    } else {
        pauseSong();
    }
}

function likeRender() {
    if (sortedPlaylist[index].like === true) {
        like.querySelector('.bi').classList.add('bi-heart-fill', 'button-active');
        like.querySelector('.bi').classList.remove('bi-heart');
    } else {
        like.querySelector('.bi').classList.add('bi-heart');
        like.querySelector('.bi').classList.remove('bi-heart-fill', 'button-active');
    }
}

function initializeSong() {
    cover.src = `cover/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeRender();
}

function previousSong() {
    if(index === 0 ){
        index = sortedPlaylist.length - 1
    } else {
        index -= 1   
    }
    initializeSong()
    playSong()
}

function nextSong() {
    if(index === sortedPlaylist.length - 1){
        index = 0
    } else {
        index += 1
    }
    initializeSong()
    playSong()
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToPosition = (clickPosition / width) * song.duration;
    song.currentTime = jumpToPosition;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0 ) {
        let randomIndex = Math.floor(Math.random() * currentIndex)
        let aux = preShuffleArray[currentIndex]
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex]
        preShuffleArray[randomIndex] = aux
        currentIndex -=1
    }
}

function shuffleButtonClicked() {
    if(isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = originalPlaylist;
        shuffleButton.classList.remove('button-active');
    }
}

function likeClicked() {
    if(sortedPlaylist[index].like === false){
        sortedPlaylist[index].like = true;
    } else {
        sortedPlaylist[index].like = false;
    }
    likeRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

function repeatClicked() {
    if(repeatOn === false) {
        repeatOn = true;
        repeat.classList.add('button-active');
    } else {
        repeatOn = false;
        repeat.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if(repeatOn === false) {
        nextSong()
    } else {
        playSong()
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let sec = Math.floor(originalNumber - hours * 3600 - min * 60)
    
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

initializeSong()

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
like.addEventListener('click', likeClicked);
repeat.addEventListener('click', repeatClicked);


