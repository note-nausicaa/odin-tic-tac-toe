function Gameboard(){
    const cells = 9;
    const board = [];

    for (let i = 0; i < cells; i++){
        board.push(Cell());
    };

    const getBoard = () => board;

    const dropToken = (cell, player) => {
        const availableCells = board.filter((cell) => cell.getValue() === 0).map(cell => board[cell]);

        if (!availableCells.length) return;

        board[cell].addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((cell) => cell.getValue());
        console.log(boardWithCellValues);
    };

    return {getBoard, dropToken, printBoard};

};

function Cell() {
    let value = 0;
    
    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController( 
    playerOneName = "Player One", 
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'x'
        },
        {
            name: playerTwoName,
            token: 'o'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`)
    }
    


    const playRound = (cell) => {

        console.log(`${getActivePlayer().name}'s ${getActivePlayer().token} into cell ${cell}`);
        board.dropToken(cell, getActivePlayer().token);
            
        let winCondition = 0;
        let combos = [
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];

        for(let i = 0; i < combos.length; i++) {

                let [a, b, c] = combos[i];

                const newBoard = board.getBoard.map([a, b, c])

                if (board.getBoard[a] === 'x') { console.log(board.getBoard[a]); return winCondition += 1} //|| board.getBoard[b] === 'x') && (board.getBoard[c] === 'x')) 
                console.log(winCondition);
                console.log(newBoard);

            }

        
    
        /*const checkWinner = () => {
            const winningIndexes = [
              [0, 3, 6],
              [1, 4, 7],
              [2, 5, 8],
              [0, 1, 2],
              [3, 4, 5],
              [6, 7, 8],
              [0, 4, 8],
              [2, 4, 6],
            ];
            for (const subArray of winningIndexes) {
              let potentialWinner = 0;
              let winner = 0;
              subArray.reduce((initialIndex, currentIndex) => {
                if (potentialWinner == board[currentIndex]) {
                  winner = board[currentIndex];
                }
                if (board[initialIndex] == board[currentIndex]) {
                  potentialWinner = board[currentIndex];
                }
              });
              if (winner != 0) {
                console.log(`The winner is ${winner}`);
                break;
              }
              console.log(winner);
            }
          };

        checkWinner();
        */

        

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell');
            cellButton.dataset.cell = index
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
            })
        }

    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.cell;
        
        if(!selectedCell) return;
        
        game.playRound(selectedCell);
        updateScreen();
        }        

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();

    }

ScreenController();



