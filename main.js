'use strict';

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
            // tile.textContent = `${row}${column}`;
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
        gameState: 'play',
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
        },
        emptBoard: ['00', '01', '02', '10', '11', '12', '20', '21', '22'],
        }


    function addMove(e){
        let row = e.target.dataset.row;
        let col = e.target.dataset.column;
        let pos = `${row}${col}`;
        const evalMov = evalMove();

        if (!evalMov.checkFilled(pos) && stats.gameState === 'play'){

            let player = stats.currentPlayer;
            stats.roundNum = stats.roundNum +1; //update round number
            stats.board.push({row, col, pos, player}); //Update board positions
            stats.rows[row].push(stats.currentPlayer.value); //Add player value to row
            stats.columns[col].push(stats.currentPlayer.value); //Add player value to column
            if(stats.leftDiag.boxes.includes(pos)) stats.leftDiag.values.push(stats.currentPlayer.value); //Add value for left diagonal if applicable
            if(stats.rightDiag.boxes.includes(pos)) stats.rightDiag.values.push(stats.currentPlayer.value); //Add check for right diagonal if applicable

            if(evalMov.checkWin(pos) || evalMov.checkTie()) {
                stats.gameState = 'End';
                if(evalMov.checkWin(pos)) stats.winnerName = stats.currentPlayer.name;
                else if (evalMov.checkTie()) stats.winnerName = 'Tie';
            }

            else (player===X) ? stats.currentPlayer=O : stats.currentPlayer=X; //increment player's turn
            
            player.bestMove();
        }


    }


    function evalMove(){
        function checkWin(pos){
            let row = pos[0];
            let col = pos[1]
            let sumRow = stats.rows[row].reduce((a,b) => a+b, 0);
            let sumCol = stats.columns[col].reduce((a,b) => a+b, 0);
            let sumLeftDiag = stats.leftDiag.values.reduce((a,b) => a+b, 0);
            let sumRightDiag = stats.rightDiag.values.reduce((a,b) => a+b, 0);
            const sums = [sumRow, sumCol, sumLeftDiag, sumRightDiag];
            if(sums.some(sum => (sum === stats.currentPlayer.value * 3))) return true;
        }

        function checkTie(){
            if(stats.board.length >= 9) return true;
        }

        function checkFilled(pos){
            return stats.board.some(tile => (tile.pos === pos))
        }

        return {
            checkWin,
            checkTie,
            checkFilled
        }
    }

    function Player(name, value, isComputer=false){
        const occupied = [];
        

        function bestMove(){

            const player = stats.currentPlayer;
            let oppPlayer;
            let score;

            (player===X) ? oppPlayer = O : oppPlayer = X;

            stats.board.forEach(space =>{
                if(stats.emptBoard.includes(space.pos)) stats.emptBoard.splice(stats.emptBoard.indexOf(space.pos), 1);
            })


            
        }

    return{
        name,
        value,
        isComputer,
        bestMove,
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
                (winnerName ==='Tie') ?  banner.textContent = `${winnerName}!!` : banner.textContent = `${winnerName} Wins!!`;
            }

        })
    }



    return {
        updateTiles,
    }
}
