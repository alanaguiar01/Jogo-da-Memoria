import Card from "./card.js";
import Figures from "./figures.js";

export default class Board {
    board
    tmpBoard = []
    firstCard = null
    secondCard = null
    twoCards = []
    minute = 0
    second = 0
    cron
    storage = []
    lockBoard = false

    constructor(boardId) {
        this.board = boardId;
    }

    create = () => {
        let startButtin = document.querySelector('#continue')
        let modal = document.querySelector('#modal-bg');
        startButtin.addEventListener('click', () => {
            modal.style.display = 'none'
            this.start()
        })
        for (let i = 0; i < Figures.number; i++) {
            this.tmpBoard.push(Figures.get(i)) //10 primeiras cartas
            this.tmpBoard.push(Figures.get(i)) //10 cartas repetidas
        }

        this.tmpBoard = this.shuffle(this.tmpBoard);
        console.log(this.tmpBoard)
    }
    shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    handleClick = (event) => {
        if (this.lockBoard) return;
        const square = event.target
        if (square.classList.contains('flip')) return;

        const position = square.id
        if (!this.firstCard) {
            this.firstCard = this.tmpBoard[position]
            square.classList.add('flip')
            this.twoCards.push(square)
            square.style.backgroundImage = 'none'
        }

        else if (!this.secondCard) {
            this.secondCard = this.tmpBoard[position]
            square.classList.add('flip')
            this.twoCards.push(square)
            this.lockBoard = true;
            const sameCard = this.checkCard()
            square.style.backgroundImage = 'none'
            if (sameCard) {
                this.twoCards = []
                console.log('acertou');
                this.firstCard = null
                this.secondCard = null
                this.lockBoard = false;
            } else {
                console.log('errou');

                console.log(this.twoCards);
                setTimeout(() => {
                    this.twoCards.forEach(card => {
                        card.classList.remove('flip');
                        card.innerHTML = `<div></div>`
                        card.style.backgroundImage = 'url(./images/innovation.png)'
                    })
                    this.twoCards = []
                    this.firstCard = null
                    this.secondCard = null
                    this.lockBoard = false;
                }, 500)
            }
        }

        setTimeout(() => {
            square.innerHTML = `<img class="imageSquare" src="${this.tmpBoard[position].picture}">`
            if (this.gameOver()) {
                this.pause()
                this.record()
                this.restartGame()
            }
        }, 100)

    }
    checkCard = () => {
        if (!this.firstCard || !this.secondCard) {
            return false;
        }
        return this.firstCard.picture === this.secondCard.picture
    }

    figureActually = () => {
        document.addEventListener('DOMContentLoaded', () => {
            let squares = document.querySelectorAll('.square');
            squares.forEach((square) => {
                square.addEventListener('click', this.handleClick)
            })
        })
    }

    gameOver = () => {
        return document.querySelectorAll('img').length == this.tmpBoard.length
    }

    restartGame = () => {
        let modal2 = document.querySelector('#modal-bg2')
        let nice = document.querySelector('.p3')
        let restart = document.querySelector('#restart')
        let name = document.querySelector('#name')
        modal2.style.display = 'flex'
        nice.innerText = `Parabéns ${String(name.value)}, agora bata seu recorde!`
        restart.onclick = () => {
            modal2.style.display = 'none'
            document.querySelectorAll('.square').forEach(cards => {
                cards.classList.remove('flip')
                cards.innerHTML = ''
                cards.style.backgroundImage = 'url(./images/innovation.png)'
            })
            this.tmpBoard = []
            for (let i = 0; i < Figures.number; i++) {
                this.tmpBoard.push(Figures.get(i))
                this.tmpBoard.push(Figures.get(i))
            }
            this.tmpBoard = this.shuffle(this.tmpBoard)
            this.start()
            this.reset()
        }
    }

    record = () => {
        let totalSeconds = this.minute * 60 + this.second;
        if (this.storage.length === 0) {
            this.storage = [this.minute, this.second, totalSeconds];
        } else {
            let recordSeconds = this.storage[2];
            if (totalSeconds < recordSeconds) {
                this.storage = [this.minute, this.second, totalSeconds];
            }
        }
        document.querySelector('#minuteR').innerHTML = String(this.storage[0]).padStart(2, '0');
        document.querySelector('#secondR').innerHTML = String(this.storage[1]).padStart(2, '0');
    }

    start = () => {
        this.cron = setInterval(() => this.timer(), 1000)
    }

    timer = () => {
        this.second += 1
        console.log(this.second);
        if (this.second == 60) {
            this.second = 0
            this.minute++
        }
        if (this.minute == 60) {
            this.minute = 0
        }

        const formatNumber = number => number >= 10 ? number : `0${number}`
        document.getElementById('minute').innerText = formatNumber(this.minute);
        document.getElementById('second').innerText = formatNumber(this.second);
    }

    reset = () => {
        this.minute = 0
        this.second = 0
        document.getElementById('minute').innerText = '00';
        document.getElementById('second').innerText = '00';
    }

    pause = () => {
        clearInterval(this.cron)
    }

}