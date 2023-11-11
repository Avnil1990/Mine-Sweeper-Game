'use strict'

const gLevels = {
    LEVEL1: { SIZE: 4, MINES: 2 },
    LEVEL2: { SIZE: 8, MINES: 14 },
    LEVEL1: { SIZE: 12, MINES: 32 }
}

const gLevel = {
    SIZE: 4,
    MINES: 3
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    cellColor: 'rgb(231, 226, 226)',
    tableColor: 'rgb(251, 212, 114)',
    mineMap: [],
    firsti: null,
    firstj: null,
    interval: 0,
    startTime: 0
}

const gSmileBtn = document.querySelector('.btn-smile')
var gBoard



function onInit() {

    startGame()
    
}



function startGame() {

    stopTimer()

    gSmileBtn.innerText = '😁'

    disableMenu()

    gGame.firsti = null
    gGame.firstj = null
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.lives = 3
    gGame.mineMap = []
    gGame.interval = 0,
        gGame.startTime = 0


    const lives = document.querySelector('.numlives')
    lives.innerText = `${gGame.lives}`

    const timer = document.querySelector('.timer')
    timer.innerText = '0.000'

    renderIntBoard()

    // minesRandomicity()

    // gBoard = buildBoard()
    // renderBoard(gBoard)
}

function disableMenu() {
    const el = document.querySelector('.outer-container')
    el.addEventListener('contextmenu', e => {
        e.preventDefault()
    })
}

function renderIntBoard() {
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gLevel.SIZE; j++) {

            const className = `cell`
            const click = `onclick="onFirstCellClicked(${i}, ${j})"`

            const value = '💣'

            strHTML += `<td class="${className}" ${click}>${value}</td>\n`
        }
        strHTML += '<tr>\n'
    }
    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
    hideCells()
}

function hideCells() {
    const els = document.querySelectorAll('.cell')
    for (var i = 0; i < els.length; i++) {
        els[i].style.opacity = '0'
    }
}

function onFirstCellClicked(i, j) {

    playSound(3)

    gGame.firsti = i
    gGame.firstj = j

    minesRandomicity()

    gBoard = buildBoard()
    renderBoard(gBoard)

    startTimer()
    updateTimer()
}

function minesRandomicity() {
    var mines = gLevel.MINES

    for (var i = 0; i < gLevel.SIZE; i++) {
        gGame.mineMap[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gGame.mineMap[i][j] = 0
        }
    }

    while (mines > 0) {

        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)

        if (i === gGame.firsti && gGame.firstj === j) continue
        if (gGame.mineMap[i][j] === 1) continue

        gGame.mineMap[i][j] = 1
        mines--
    }

    console.table(gGame.mineMap)
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {

            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false,
                cellColor: gGame.cellColor,
                tableColor: gGame.tableColor,
                color: null,
                opacity: '0'
            }

            if (gGame.mineMap[i][j] === 1) board[i][j].isMine = true
        }
    }

    board = setMinesNegsCount(board)
    board = checkColor(board)
    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            const minesAroundCell = countNeighborsAround(board, i, j)
            board[i][j].minesAroundCount = minesAroundCell
            if (board[i][j].minesAroundCount === 0) {
                board[i][j].minesAroundCount = ''
            }
        }
    }
    return board
}

function checkColor(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            const mineCount = board[i][j].minesAroundCount

            if (mineCount === 1) board[i][j].color = `blue`
            if (mineCount === 2) board[i][j].color = `green`
            if (mineCount === 3) board[i][j].color = `red`
            if (mineCount > 3 && mineCount < 9) board[i][j].color = 'darkblue'
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gLevel.SIZE; j++) {

            const cell = board[i][j]
            const color = cell.color
            const className = `cell`
            const dataAtt = `data-i="${i}" data-j="${j}"`
            const mark = `oncontextmenu="onCellMarked(this, ${i}, ${j});"`
            const click = `onclick="onCellClicked(this, ${i}, ${j})"`

            const value = (board[i][j].isMine) ? '💣' : board[i][j].minesAroundCount

            strHTML += `<td style="color: ${color}" ${dataAtt} class="${className}" ${click} ${mark}>${value}</td>\n`
        }
        strHTML += '<tr>\n'
    }
    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
    hideCells()
    handleFirstCell()
}



function onCellClicked(elCell, i, j) {

    if (gBoard[i][j].isShown || gBoard[i][j].isMark || !gGame.isOn) return

    playSound(3)

    gBoard[i][j].isShown = !gBoard[i][j].isShown
    gGame.shownCount++
    elCell.style.opacity = '1'

    if (gBoard[i][j].isMine) {

        gGame.lives--

        if (gGame.lives === 0) {

            playSound(5)

            gGame.isOn = !gGame.isOn
            gSmileBtn.innerText = '😫'
            elCell.innerText = '💥'
            elCell.style.backgroundColor = 'orange'
            elCell.style.opacity = '1'

            const lives = document.querySelector('.numlives')
            lives.innerText = `${gGame.lives}`

            stopTimer()
        } else {

            playSound(4)

            elCell.style.backgroundColor = 'orange'
            elCell.style.opacity = '1'

            gSmileBtn.innerText = '😯'
            setTimeout(() => { gSmileBtn.innerText = '😁' }, 500)

            const lives = document.querySelector('.numlives')
            lives.innerText = `${gGame.lives}`

            if (checkGameOver()) {
                playSound2(6)
                gGame.isOn = !gGame.isOn
                gSmileBtn.innerText = '😎'
                stopTimer()
            }
        }
    } else {
        if (checkGameOver()) {
            playSound2(6)
            gGame.isOn = !gGame.isOn
            gSmileBtn.innerText = '😎'
            stopTimer()
        }
    }
}

function onCellMarked(elCell, i, j) {

    if (gBoard[i][j].isShown || !gGame.isOn) return

    playSound(3)

    if (!gBoard[i][j].isMark) {
        gBoard[i][j].isMark = !gBoard[i][j].isMark
        gBoard[i][j].cellColor = gGame.tableColor
        gBoard[i][j].opacity = '1'
        if (gBoard[i][j].isMine) gGame.markedCount++

        elCell.innerText = '🚩'
        elCell.style.backgroundColor = gBoard[i][j].cellColor
        elCell.style.opacity = '1'
        if (checkGameOver()) {
            playSound2(6)
            gGame.isOn = !gGame.isOn
            gSmileBtn.innerText = '😎'
            stopTimer()
        }
    } else {
        gBoard[i][j].isMark = !gBoard[i][j].isMark
        gBoard[i][j].cellColor = gGame.cellColor
        gBoard[i][j].opacity = '0'

        if (gBoard[i][j].isMine) {
            gGame.markedCount--
            elCell.innerText = "💣"
            elCell.style.backgroundColor = gBoard[i][j].cellColor
            elCell.style.opacity = '0'
        } else {
            elCell.innerText = gBoard[i][j].minesAroundCount
            if (gBoard[i][j].minesAroundCount === 0) elCell.innerText = ''
            elCell.style.color = gBoard[i][j].color
            elCell.style.backgroundColor = gBoard[i][j].cellColor
            elCell.style.opacity = '0'
        }
    }
}

function handleFirstCell() {
    gBoard[gGame.firsti][gGame.firstj].isShown = true
    gGame.shownCount++

    const firstCell = document.querySelector(`[data-i="${gGame.firsti}"][data-j="${gGame.firstj}"]`)
    firstCell.style.opacity = '1'
}

function checkGameOver() {
    const numCells = gLevel.SIZE ** 2
    const marked = gGame.markedCount
    const shown = gGame.shownCount
    const lives = gGame.lives
    return (marked + shown === numCells) ? true : false
}

function updateTimer() {
    const currentTime = new Date().getTime()
    const elapsedTime = (currentTime - gGame.startTime) / 1000
    document.querySelector('.timer').innerText = elapsedTime.toFixed(3)
}

function startTimer() {
    gGame.startTime = new Date().getTime()
    gGame.interval = setInterval(updateTimer, 37)
}

function stopTimer() {
    clearInterval(gGame.interval)
}

function chooseLevel(size, mines) {

    playSound(1)

    gLevel.SIZE = size
    gLevel.MINES = mines

    const intro = document.querySelector('.intro')
    intro.style.display = 'none'

    const game = document.querySelector('.outer-container')
    game.style.display = 'block'

    const back = document.querySelector('.back')
    back.style.display = 'block'

    const timer = document.querySelector('.timer')
    timer.style.display = 'block'

    startGame()
}

function goBack() {

    playSound(1)

    const intro = document.querySelector('.intro')
    intro.style.display = 'block'

    const game = document.querySelector('.outer-container')
    game.style.display = 'none'

    const back = document.querySelector('.back')
    back.style.display = 'none'

    const timer = document.querySelector('.timer')
    timer.style.display = 'none'

    stopTimer()
}

function restart() {
    playSound(2)
    startGame()
}


// I didn't make it with the recursion...

// function expandShown(board, elCell, i, j) {
//     if (countNeighborsAround(board, i, j) !== 0) return

//     board[i][j].isShown = !board[i][j].isShown
//     gGame.shownCount++

//     elCell.style.opacity = '1'

//    expandShown(board, elCell, i + 1, j)
//    expandShown(board, elCell, i - 1, j)
//    expandShown(board, elCell, i, j + 1)
//    expandShown(board, elCell, i, j - 1)
//    expandShown(board, elCell, i + 1, j + 1)
//    expandShown(board, elCell, i + 1, j - 1)
//    expandShown(board, elCell, i - 1, j + 1)
//    expandShown(board, elCell, i - 1, j - 1)

// }



// Not a very successful minesRandomicity function...

// function minesRandomicity() {

//     var mines = gLevel.MINES

//     for (var i = 0; i < gLevel.SIZE; i++) {
//         gGame.mineMap[i] = []

//         for (var j = 0; j < gLevel.SIZE; j++) {
//             var binaryNum = Math.round(Math.random())

//             if (mines === 0) gGame.mineMap[i][j] = 0

//             else if (binaryNum === 1) {
//                 gGame.mineMap[i][j] = 1
//                 mines--
//             } else gGame.mineMap[i][j] = 0
//         }
//     }

//     console.table(gGame.mineMap)
// }



