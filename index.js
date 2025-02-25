const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
const resetButton = document.getElementById('reset');

let board = [];
let currentPlayer = CROSS;
let gameActive = true;
let size = 3; // Размер поля

startGame();
addResetListener();

function startGame() {
    board = Array(size).fill(null).map(() => Array(size).fill(EMPTY));
    renderGrid(size);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
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

    currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
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
    gameActive = true;
    currentPlayer = CROSS;
    startGame();
}

function checkWinner(player) {
    for (let i = 0; i < size; i++) {
        if (board[i].every(cell => cell === player) || board.map(row => row[i]).every(cell => cell === player)) {
            highlightWinner(i, 'row');
            return true;
        }
    }

    if (board.map((row, i) => row[i]).every(cell => cell === player)) {
        highlightWinner(0, 'diag1');
        return true;
    }

    if (board.map((row, i) => row[size - 1 - i]).every(cell => cell === player)) {
        highlightWinner(0, 'diag2');
        return true;
    }

    return false;
}

function highlightWinner(index, type) {
    if (type === 'row') {
        for (let j = 0; j < size; j++) {
            renderSymbolInCell(board[index][j], index, j, 'red');
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
