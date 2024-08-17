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
    playerOneName, 
    playerTwoName
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'x',
            score: 0
        },
        {
            name: playerTwoName,
            token: 'o',
            score: 0
        }
    ];

    let activePlayer = players[0];
    let unactivePlayer = players[1];
    let winner = 0;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getUnactivePlayer = () => unactivePlayer;

    const getPlayers = () => players;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`)
    }

    const checkWin = () => winner;

    const reset = () => {
        for(i = 0; i <= 8; i++) {board.dropToken(i, 0)};
        winner = 0;
        board.printBoard();
    }
    
    const playRound = (cell) => {
        console.log(`${getActivePlayer().name}'s ${getActivePlayer().token} into cell ${cell}`);
        board.dropToken(cell, getActivePlayer().token);
        
        const combos = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6],
            ];

        for (let i = 0; i < combos.length; i++) {
            
                let [a, b, c] = combos[i];

                let gameBoard = board.getBoard();

                const boardWithCellValues = gameBoard.map((cell) => cell.getValue());
                
                if (boardWithCellValues[a].valueOf() !== 0 && boardWithCellValues[a].valueOf() === boardWithCellValues[b].valueOf() && boardWithCellValues[b].valueOf() === boardWithCellValues[c].valueOf())
                    {winner = 1; console.log(winner);
                        getActivePlayer().score++;
                        //Reset board?
                        return {
                            checkWin,
                            getActivePlayer,
                            getUnactivePlayer,
                            getBoard: board.getBoard,
                        };
                    }
            }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();



    return {
        getPlayers,
        playRound,
        checkWin,
        getActivePlayer,
        getUnactivePlayer,
        getBoard: board.getBoard,
        reset
    }
}

function ScreenController() {

    const playerOneInput = document.getElementById('player-one-name');
    const playerTwoInput = document.getElementById('player-two-name');

    let playerOneName = playerOneInput.value;
    let playerTwoName = playerTwoInput.value;

    const game = GameController(playerOneName, playerTwoName);

    const players = game.getPlayers();

    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const scoreDiv = document.querySelector('.score');

    const playerOneSubmitBtn = document.querySelector('#p1-submit');
    const playerTwoSubmitBtn = document.querySelector('#p2-submit');

    const updateScreen = () => {
        boardDiv.textContent = "";

        scoreDiv.textContent = "";

        const board = game.getBoard();
        
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        scoreDiv.textContent = `${players[0].name}: ${players[0].score} | ${players[1].name}: ${players[1].score}`
    
        board.forEach((cell, index) => {

            const cellButton = document.createElement('button');

            cellButton.classList.add('cell');

            cellButton.dataset.cell = index

            cellButton.textContent = cell.getValue();

            if (cellButton.textContent === 'o') {cellButton.classList.add('blue')};

            if (cellButton.textContent === 'x') {cellButton.classList.add('pinker')}

            boardDiv.appendChild(cellButton);

        });

            if (game.checkWin() == 1) 
            {  
                playerTurnDiv.classList.add('win'); 
                
                playerTurnDiv.textContent = "";
                
                playerTurnDiv.textContent = `${activePlayer.name} wins!`
                const resetBtn = document.querySelector('.reset');
                resetBtn.classList.add('show');
                resetBtn.addEventListener('click', () => {
                    game.reset();
                    playerTurnDiv.classList.remove('win')
                    resetBtn.classList.remove('show');
                    updateScreen();
                    })
                
            };

};

    const modifyProperty = (array, targetID, newProperty) => {
        const targetObj = array.find(obj => obj.token === targetID);
        if (targetObj) {
            targetObj.name = newProperty;
        };
    };


    function clickHandlerBoard(e) {
        const selectedCell = e.target.dataset.cell;
        
        if(!selectedCell) return;

        
        game.playRound(selectedCell);
        updateScreen();
    };      

    boardDiv.addEventListener('click', clickHandlerBoard);

    playerOneSubmitBtn.addEventListener('click', () => {
        
        let newName = playerOneInput.value;

        modifyProperty(players, 'x', newName)
        playerOneInput.value = "";
        updateScreen();
    });

    playerTwoSubmitBtn.addEventListener('click', () => {
        
        let newName = playerTwoInput.value;

        modifyProperty(players, 'o', newName);
        playerTwoInput.value ="";

        updateScreen();
    });

    const resetScoreBtn = document.querySelector('.reset-score');

    resetScoreBtn.addEventListener('click', () => {
        const playerScores = players.find(player => player.score);
            if (playerScores) {
                players[0].score = 0;
                players[1].score = 0;
                updateScreen();
            };
    })
    
    updateScreen();

};


ScreenController();