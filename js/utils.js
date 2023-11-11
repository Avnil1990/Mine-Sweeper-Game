
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function countNeighborsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

function playSound(soundNum) {
    const sound = new Audio(`sounds/${soundNum}.wav`)
    sound.play()
}

function playSound2(soundNum) {
    const sound = new Audio(`sounds/${soundNum}.mp3`)
    sound.play()
}




// function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
// }

// function printPrimaryDiagonal(squareMat) {
//     for (var d = 0; d < squareMat.length; d++) {
//         var item = squareMat[d][d]
//         console.log(item)
//     }
// }

// function printSecondaryDiagonal(squareMat) {
//     for (var d = 0; d < squareMat.length; d++) {
//         var item = squareMat[d][squareMat.length - d - 1]
//         console.log(item)
//     }
// }

// function makeId(length = 6) {
//     var txt = ''
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length))
//     }

//     return txt
// }

// function generateColor() {
//     const hexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
//     let code = "";
//     for (let i = 0; i < 6; i++) {
//         code += hexArray[Math.floor(Math.random() * 16)];
//     }
//     return `#${code}`
// }

// function renderBoard(board) {
//     // DONE: Render the board
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>\n'
//         for (var j = 0; j < board[i].length; j++) {
//             const cell = board[i][j]
//             const className = `cell cell-${i}-${j}`
//             strHTML += `<td class="${className}">${cell}</td>\n`
//         }
//         strHTML += '</tr>\n'
//     }

//     // console.log('strHTML', strHTML)
//     const elTable = document.querySelector('.board')
//     elTable.innerHTML = strHTML
// }

// function renderCell(location, value) {
//     // Select the elCell and set the value
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

// function getClassName(position) {
//     const cellClass = `cell-${position.i}-${position.j}`
//     return cellClass
// }
