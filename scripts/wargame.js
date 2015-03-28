// YOUR CODE GOES HERE
var aiThinking = false;

var Game = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    // needs to hold the array representation of the current board so AI could get next move from board
    var out = [];
    for (var row = 0; row < 6; row++) {
        var r = []
        for (var col = 0; col < 6; col++) {
            r.push(new Tile((row * 6 + col), $("#app-board").find("td#" + (row * 6 + col)).html(), null));
        }
        out.push(r);
    }
    this.board = out;
    this.turnCount = 0;
};

Game.prototype.getScore = function (player) {
    var score = 0;

    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (this.board[row][col].belongsTo === player) {
                score += parseInt($("#app-board").find("td#" + (row * 6 + col)).html());
            }
        }
    }
    return score;
}

Game.prototype.printBoard = function () {
    for (var row = 0; row < 6; row++) {
        var str = '';
        for (var col = 0; col < 6; col++) {
            if (this.board[row][col].belongsTo === null) {
                str += ' .';
            } else {
                str += ' ' + this.board[row][col].belongsTo.toString();
            }
        }
        console.log(str);
    }
};

Game.prototype.gameOver = function () {
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (this.board[row][col].belongsTo === null) {
                return false;
            }
        }
    }

    return true;
};

Game.prototype.goLive = function () {
    var currentGame = this; // grab a hold of this

    $('.tile').click(function () {
        var currentPlayer = currentGame.turnCount % 2;

        if (!aiThinking) {
            // declaring AI player for current turn
            var currentAI = new Minimax(currentGame.board);
            var move, tileID; // get next move

            if (currentPlayer === 0 && currentGame.p1 === "HM") {
                tileID = $(this).attr('id');
            } else {
                aiThinking = true;
                move = currentAI.getMove(currentPlayer);
                tileID = move["tile"];
            }
            var color = (currentPlayer === 0? '#FF0000' : '#3366FF');

            // break into coordinate for array manipulation
            var row, col;
            row = Math.floor(tileID / 6);
            col = tileID - row * 6;
            console.log('Player ' + currentPlayer + ' chose tile ' + tileID + ' (row: ' + row + ', col: ' + col + ')!');
            var M1DBMoves = currentAI.getM1DeathBlitzMoves(currentPlayer);

            currentGame.board[row][col].belongsTo = currentPlayer;
            $("#app-board").find("td#" + tileID).css('backgroundColor', color);

            // process capturing for M1DB moves
            if (M1DBMoves.hasOwnProperty(tileID)) {
                var cap = currentAI.capturable(tileID, currentPlayer);

                if (cap.length > 0) {
                    for (var i0 = 0; i0 < cap.length; i0++) {
                        //console.log(cap[i]);
                        var r0 = Math.floor(cap[i0] / 6);
                        var c0 = cap[i0] - r0 * 6;

                        currentGame.board[r0][c0].belongsTo = currentPlayer;
                        $("#app-board").find("td#" + cap[i0]).css('backgroundColor', color);
                    }
                }
            }
            // update score board
            $('#app-p0-score').html(currentGame.getScore(0));
            $('#app-p1-score').html(currentGame.getScore(1));

            aiThinking = false;
            currentGame.turnCount += 1;
            currentPlayer = currentGame.turnCount % 2;

            if (currentGame.gameOver()) {
                currentGame.printBoard();
                console.log("Game Over!");

                if (currentGame.getScore(0) > currentGame.getScore(1)) {
                    $('#app-message').html('Player 1 won!');
                } else {
                    $('#app-message').html('Player 2 won!');
                }

            } else {
                console.log("Player " + currentPlayer + " has next move");
                // trigger next player
                if (currentPlayer === 1) {
                    $("#app-board").find("td#0").trigger('click');
                } else {
                    if (currentGame.p1 === "MM") {
                        $("#app-board").find("td#0").trigger('click');
                    }
                }
            }
        } else {
            $('#app-message').html(currentPlayer + ' has not completed her move. Please wait!');
        }
    });
};

Game.prototype.startGame = function () {
    // Add the event listeners
    this.goLive();
    $('#app-message').html('Game between ' + this.p1 + ' and ' + this.p2 + ' started!');

    // this is where to trigger AI vs AI games
    if (this.p1 === "MM") {
        $("#app-board").find("td#0").trigger('click');
    }
};
// end of Board object definition

// actual app
$(function () {
    $('#app-message').html('Press |Start game| to play.');
    $('#app-button').click(function () {
        var p1 = $('#app-player1').val();
        var p2 = $('#app-player2').val();

        var game = new Game(p1, p2);
        game.startGame();
    });
});
// end of file
