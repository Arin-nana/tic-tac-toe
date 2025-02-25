const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const resetButton = document.getElementById('reset');

let board = [];
let currentPlayer = CROSS;
let gameActive = true;
let size = 3;

startGame();
addResetListener();

function startGame() {
    let inputSize = prompt("Введите размер поля (минимум 3):", "3");
    size = parseInt(inputSize);
    if (isNaN(size) || size < 3) {
        size = 3;
    }
    gameActive = true;
    currentPlayer = CROSS;
    board = Array(size).fill(null).map(() => Array(size).fill(EMPTY));
    renderGrid(size);
}

function renderGrid(dimension) {
    container.innerHTML = '';
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = board[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    if (!gameActive || board[row][col] !== EMPTY) return;

    board[row][col] = currentPlayer;
    renderSymbolInCell(currentPlayer, row, col);

    if (checkWinner(currentPlayer)) {
        gameActive = false;
        alert(`Победитель: ${currentPlayer}`);
        return;
    }

    if (board.flat().every(cell => cell !== EMPTY)) {
        alert("Победила дружба!");
        gameActive = false;
        return;
    }
    
    checkExpandBoard();

    currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
    if (currentPlayer === ZERO && gameActive) {
        setTimeout(aiMove, 100);
    }
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    return container.querySelectorAll('tr')[row].querySelectorAll('td')[col];
}

function addResetListener() {
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    startGame();
}

function checkWinner(player, doHighlight = true) {
    for (let i = 0; i < size; i++) {
        if (board[i].every(cell => cell === player)) {
            if (doHighlight) highlightWinner(i, 'row');
            return true;
        }
        if (board.map(row => row[i]).every(cell => cell === player)) {
            if (doHighlight) highlightWinner(i, 'col');
            return true;
        }
    }

    if (board.map((row, i) => row[i]).every(cell => cell === player)) {
        if (doHighlight) highlightWinner(0, 'diag1');
        return true;
    }

    if (board.map((row, i) => row[size - 1 - i]).every(cell => cell === player)) {
        if (doHighlight) highlightWinner(0, 'diag2');
        return true;
    }

    return false;
}

function highlightWinner(index, type) {
    if (type === 'row') {
        for (let j = 0; j < size; j++) {
            renderSymbolInCell(board[index][j], index, j, 'red');
        }
    } else if (type === 'col') {
        for (let i = 0; i < size; i++) {
            renderSymbolInCell(board[i][index], i, index, 'red');
        }
    } else if (type === 'diag1') {
        for (let i = 0; i < size; i++) {
            renderSymbolInCell(board[i][i], i, i, 'red');
        }
    } else if (type === 'diag2') {
        for (let i = 0; i < size; i++) {
            renderSymbolInCell(board[i][size - 1 - i], i, size - 1 - i, 'red');
        }
    }
}

function checkWinnerOnBoard(testBoard, player) {
    const n = testBoard.length;
    for (let i = 0; i < n; i++) {
        if (testBoard[i].every(cell => cell === player)) return true;
        if (testBoard.map(row => row[i]).every(cell => cell === player)) return true;
    }
    if (testBoard.map((row, i) => row[i]).every(cell => cell === player)) return true;
    if (testBoard.map((row, i) => row[n - 1 - i]).every(cell => cell === player)) return true;
    return false;
}

function aiMove() {
    if (!gameActive) return;
    let moveMade = false;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === EMPTY) {
                let boardClone = board.map(row => row.slice());
                boardClone[i][j] = ZERO;
                if (checkWinnerOnBoard(boardClone, ZERO)) {
                    board[i][j] = ZERO;
                    renderSymbolInCell(ZERO, i, j, 'blue');
                    moveMade = true;
                    if (checkWinner(ZERO)) {
                        gameActive = false;
                        alert(`Победитель: ${ZERO}`);
                    }
                    break;
                }
            }
        }
        if (moveMade) break;
    }

    if (!moveMade) {
        let emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === EMPTY) {
                    emptyCells.push({ i, j });
                }
            }
        }
        if (emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length);
            let cell = emptyCells[randomIndex];
            board[cell.i][cell.j] = ZERO;
            renderSymbolInCell(ZERO, cell.i, cell.j, 'blue');
            if (checkWinner(ZERO)) {
                gameActive = false;
                alert(`Победитель: ${ZERO}`);
            }
        }
    }

    if (board.flat().every(cell => cell !== EMPTY)) {
        alert("Победила дружба!");
        gameActive = false;
    }

    checkExpandBoard();
    currentPlayer = CROSS;
}

function checkExpandBoard() {
    let filledCount = board.flat().filter(cell => cell !== EMPTY).length;
    let totalCells = size * size;
    if (filledCount > totalCells / 2) {
        expandBoard();
    }
}

function expandBoard() {
    let oldSize = size;
    let newSize = oldSize + 2;
    let newBoard = Array(newSize).fill(null).map(() => Array(newSize).fill(EMPTY));

    for (let i = 0; i < oldSize; i++) {
        for (let j = 0; j < oldSize; j++) {
            newBoard[i + 1][j + 1] = board[i][j];
        }
    }
    board = newBoard;
    size = newSize;
    renderGrid(size);
}
