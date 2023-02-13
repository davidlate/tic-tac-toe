"use strict";
const game = GameStatus();



(function gameBoardSetup (numRows = 3, numColumns = 3) {

    const gameBoard = document.querySelector('.gameBoard');

    gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

    for (let row=0; row<=numRows-1; row++){
        for (let column=0; column<=numColumns-1; column++){
            let tile = gameBoard.appendChild(document.createElement('div'));
            tile.classList.add('tile');
            tile.dataset.row = row;
            tile.dataset.column = column;
            tile.textContent = `R${row} C${column}`;
        }
    }

    let tile = document.querySelectorAll('.tile');
    tile.forEach(til => til.addEventListener('click', game.addMove));

})();



function GameStatus() {

    const stats = {
        roundNum: 0,
        board: [],
        player: 'X'
    }


    function addMove(e){
        let row = e.target.dataset.row;
        let col = e.target.dataset.row;
        let pos = `${row}${col}`;
        let currentPlayer = stats.player;
        stats.roundNum = stats.roundNum +1;
        stats.board.push({row, col, pos, currentPlayer});

        (currentPlayer==='X') ? stats.player='O' : stats.player='X';

        console.log(stats.board)
    }

    return{
        addMove,
    }
};





//     function update (e){
//         console.log(gameStatus.round);
//         gameStatus.round = gameStatus.round + 1;
    

//         let row = e.target.dataset.row;
//         let column = e.target.dataset.column;

//         gameStatus.board.push({
//             row: row,
//             column: column,
//             player: currentPlayer});

//             (gameStatus.currentPlayer ==='X') ? 'O' : 'X' ;

//         gameStatus.roundNum = gameStatus.roundNum + 1;

//         console.log(gameStatus)
//         };



//     return {update};
// }