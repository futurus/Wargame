// YOUR CODE GOES HERE
var aiThinking = false;
var startTime;
var delay = 1000;

// generating random moves
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom6By6() {
    var out = [];
    for (var row = 0; row < 6; row++) {
        var r = []
        for (var col = 0; col < 6; col++) {
            r.push(getRandomInt(1, 100));
        }
        out.push(r);
    }
    return out;
}

var Keren = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1]
];

var Narvik = [
    [99,  1, 99,  1, 99,  1],
    [ 1, 99,  1, 99,  1, 99],
    [99,  1, 99,  1, 99,  1],
    [ 1, 99,  1, 99,  1, 99],
    [99,  1, 99,  1, 99,  1],
    [ 1, 99,  1, 99,  1, 99]
];

var Sevastopol = [
    [ 1,  1,  1,  1,  1,  1],
    [ 2,  2,  2,  2,  2,  2],
    [ 4,  4,  4,  4,  4,  4],
    [ 8,  8,  8,  8,  8,  8],
    [16, 16, 16, 16, 16, 16],
    [32, 32, 32, 32, 32, 32]
];

var Smolensk = [
    [66, 76, 28, 66, 11,  9],
    [31, 39, 50,  8, 33, 14],
    [80, 76, 39, 59,  2, 48],
    [50, 73, 43,  3, 13,  3],
    [99, 45, 72, 87, 49,  4],
    [80, 63, 92, 28, 61, 53]
];

var Westerplatte = [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 4, 4, 3, 1],
    [1, 4, 2, 2, 4, 1],
    [1, 4, 2, 2, 4, 1],
    [1, 3, 4, 4, 3, 1],
    [1, 1, 1, 1, 1, 1]
];

var Game = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    // needs to hold the array representation of the current board so AI could get next move from board
    this.board = [];
    this.turnCount = 0;
};

Game.prototype.assignBoard = function() {
    var out = [];
    for (var row = 0; row < 6; row++) {
        var r = [];
        for (var col = 0; col < 6; col++) {
            r.push(new Tile((row * 6 + col), $("#app-board").find("td#" + (row * 6 + col)).html(), null));
        }
        out.push(r);
    }
    this.board = out;
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
};

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
    startTime = performance.now();

    $('.tile').click(function () {
        var currentPlayer = currentGame.turnCount % 2;

        if (!aiThinking) {
            // declaring AI player for current turn
            var currentAI;
            var move, tileID; // get next move

            if (currentPlayer === 0 && currentGame.p1 === "HM") {
                currentAI = new superAI(currentGame.board);
                tileID = $(this).attr('id');
            } else {
                $('#app-p' + currentPlayer + '-msg').html('Thinking!');
                if (currentPlayer === 0 && currentGame.p1 === "MM") {
                    currentAI = new Minimax(currentGame.board);
                } else if (currentPlayer === 0 && currentGame.p1 === "AB") {
                    currentAI = new ABPruning(currentGame.board);
                } else if (currentPlayer === 1 && currentGame.p2 === "MM") {
                    currentAI = new Minimax(currentGame.board);
                } else if (currentPlayer === 1 && currentGame.p2 === "AB") {
                    currentAI = new ABPruning(currentGame.board);
                }

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

            if (currentGame.gameOver()) {
                currentGame.printBoard();
                console.log("Game Over!");

                if (currentGame.getScore(0) > currentGame.getScore(1)) {
                    $('#app-message').html('Player 1 won!');
                } else {
                    $('#app-message').html('Player 2 won!');
                }

            } else {
                $('#app-p' + currentPlayer + '-msg').html('I chose ' + tileID + ', took me '  + ' to make that decision.');

                aiThinking = false;
                currentGame.turnCount += 1;
                currentPlayer = currentGame.turnCount % 2;
                console.log("Player " + currentPlayer + " has next move");
                $('#app-p' + currentPlayer + '-msg').html('My turn.');

                // trigger next player
                if (currentPlayer === 1) {
                    setTimeout(function(){
                        $("#app-board").find("td#0").trigger('click');
                    }, delay);
                } else {
                    if (currentGame.p1 !== "HM") {
                        setTimeout(function(){
                            $("#app-board").find("td#0").trigger('click');
                        }, delay);
                    }
                }
            }
        }
    });
};

Game.prototype.startGame = function () {
    // generate board
    this.assignBoard();
    // Add the event listeners
    this.goLive();
    $('#app-message').html('Game between ' + this.p1 + ' and ' + this.p2 + ' started!');

    // this is where to trigger AI vs AI games
    if (this.p1 !== "HM") {
        $("#app-board").find("td#0").trigger('click');
    }
};
// end of Board object definition

// actual app
$(function () {
    $('#app-message').html("Choose settings then press 'Start game' to play. 'New Game' to start over.");
    $('#app-button').click(function () {
        var p1 = $('#app-player1').val();
        var p2 = $('#app-player2').val();
        var map = $('#app-choose-board').val();
        var board;

        if (map == "RD") {
            board = getRandom6By6();
        } else if (map == "KR") {
            board = Keren;
        } else if (map == "NV") {
            board = Narvik;
        } else if (map == "SE") {
            board = Sevastopol;
        } else if (map == "SM") {
            board = Smolensk;
        } else if (map == "WP") {
            board = Westerplatte;
        }

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                $("#app-board").find("td#" + (i * 6 + j)).html(board[i][j]);
            }
        }

        var game = new Game(p1, p2);
        game.startGame();
    });
    $('#app-newgame').click(function () {
        location.reload();
    });
});
// end of file
