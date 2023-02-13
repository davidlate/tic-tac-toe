"use strict";
const game = GameStatus();
const display = DisplayController();


(function gameBoardSetup (numRows = 3, numColumns = 3) {

    const gameBoard = document.querySelector('.gameBoard');

    gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

    for (let row=0; row<=numRows-1; row++){
        for (let column=0; column<=numColumns-1; column++){
            let tile = gameBoard.appendChild(document.createElement('div'));
            tile.classList.add('tile');
            tile.dataset.row = row;
            tile.dataset.column = column;
            tile.dataset.pos = `${row}${column}`;
            tile.textContent = `${row}${column}`;
        }
    }

    let tile = document.querySelectorAll('.tile');
    tile.forEach(til => til.addEventListener('click', game.addMove));
    tile.forEach(til => til.addEventListener('click', display.updateTiles));


})();



function GameStatus() {

    const X = Player('X', 1); //set values for each player to check each row for the proper sum for winning
    const O = Player('O', 10);

    const stats = {
        roundNum: 0,
        board: [],
        currentPlayer: X,
        winnerName: '',
        rows: {
            0: [],
            1: [],
            2: [],
        },
        columns: {
            0: [],
            1: [],
            2: [],
        },
        leftDiag:{
            boxes:['00', '11', '22'],
            values: []
        },
        rightDiag:{
            boxes:['20', '11', '02'],
            values: []
        }
        }


    function addMove(e){
        let row = e.target.dataset.row;
        let col = e.target.dataset.column;
        let pos = `${row}${col}`;

        if (!checkFilled()){

            let player = stats.currentPlayer;
            stats.roundNum = stats.roundNum +1; //update round number
            stats.board.push({row, col, pos, player}); //Update board positions
            stats.rows[row].push(stats.currentPlayer.value); //Add player value to row
            stats.columns[col].push(stats.currentPlayer.value); //Add player value to column
            if(stats.leftDiag.boxes.includes(pos)) stats.leftDiag.values.push(stats.currentPlayer.value); //Add value for left diagonal if applicable
            if(stats.rightDiag.boxes.includes(pos)) stats.rightDiag.values.push(stats.currentPlayer.value); //Add check for right diagonal if applicable


            if(checkWin(row, col, stats.currentPlayer)) {
                // console.log(`${stats.currentPlayer.name} Wins!!!`);
                stats.winnerName = stats.currentPlayer.name;
            }
            else {
                (player===X) ? stats.currentPlayer=O : stats.currentPlayer=X;
            }
        }

        function checkFilled(){
            return stats.board.some(tile => (tile.pos === pos))
        }
    }


    function checkWin(row, col, player){

        let sumRow = stats.rows[row].reduce((a,b) => a+b, 0);
        let sumCol = stats.columns[col].reduce((a,b) => a+b, 0);
        let sumLeftDiag = stats.leftDiag.values.reduce((a,b) => a+b, 0);
        let sumRightDiag = stats.rightDiag.values.reduce((a,b) => a+b, 0);

        const sums = [sumRow, sumCol, sumLeftDiag, sumRightDiag];

        if(sums.some(sum => (sum === player.value * 3))) return true;
    }



    function Player(name, value){
        const occupied = [];
       
        return{
            name,
            value,
        }
    }

    return{
        addMove,
        stats,
    }
};






function DisplayController(){

    function updateTiles(){

            game.stats.board.forEach(item => {
            let square = document.querySelector(`[data-pos='${item.pos}']`);
            square.textContent = item.player.name;
            if(game.stats.winnerName !== '') {
                let winnerName = game.stats.winnerName
                let banner = document.querySelector('.lowerInfo');
                banner.textContent = `${winnerName} Wins!!`;
            }

        })
    }



    return {
        updateTiles,
    }
}
