let deckId
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")

if(!deckId)
{
    drawCardBtn.disabled = true
}

function reset()
{
    cardsContainer.children[0].innerHTML = ``
    cardsContainer.children[1].innerHTML = ``
    remainingText.textContent = ``
    header.textContent = `Game of War`
    computerScoreEl.textContent = `Computer score: 0`
    myScoreEl.textContent = `My score: 0`
    computerScore = 0
    myScore = 0
}

function handleClick() {
    reset()
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
        })
        drawCardBtn.disabled = false
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    if(deckId)
    {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            
            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                if (computerScore > myScore) {
                    
                    header.textContent = "The computer won the game!"
                } else if (myScore > computerScore) {
                    
                    header.textContent = "You won the game!"
                } else {
                   
                    header.textContent = "It's a tie game!"
                }
            }
        })
    }
})


function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `Computer score: ${computerScore}`
        return "Computer wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++
        myScoreEl.textContent = `My score: ${myScore}`
        return "You win!"
    } else {
        return "War!"
    }
}

