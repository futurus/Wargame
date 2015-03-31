// YOUR CODE GOES HERE
var aiThinking = false;
var startTime;
var reTime;
var delay = 0;

// to get current timestamp
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() +
        ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() +
        ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds() +
        "." + this.getMilliseconds();
}

// generating random moves
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function translatePosition(id) {
    var columns = ["A", "B", "C", "D", "E", "F"];
    var rows = ["1", "2", "3", "4", "5", "6"];

    var r0 = Math.floor(id / 6);
    var c0 = id - r0 * 6;

    return columns[c0] + rows[r0];
}

function getRandom6By6() {
    var out = [];
    for (var row = 0; row < 6; row++) {
        var r = [];
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
    this.gamma = 1;
    this.turnCount = 0;
};

Game.prototype.setGamma = function(gamma) {
    this.gamma = gamma;
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

    $('.tile').click(function () {
        var choice;
        var currentPlayer = currentGame.turnCount % 2;
        var currentPlayerType = currentPlayer === 0 ? currentGame.p1 : currentGame.p2;

        if (!aiThinking) {
            // declaring AI player for current turn
            var currentAI;
            var move, tileID, moveType; // get next move
            var M1DBMoves, SABMoves, CPDMoves;

            if (currentPlayer === 0 && currentGame.p1 === "HM") {
                if (currentGame.p2 === "EM") {
                    currentAI = new Expectiminimax(currentGame.board, currentGame.gamma);
                    SABMoves = currentAI.getSabotageMoves(currentPlayer);
                } else {
                    currentAI = new superAI(currentGame.board);
                }
                tileID = $(this).attr('id');
                M1DBMoves = currentAI.getM1DeathBlitzMoves(currentPlayer);
                CPDMoves = currentAI.getCommandoParaDropMoves(currentPlayer);

                if (M1DBMoves.hasOwnProperty(tileID)) {
                    moveType = "M1DB";
                } else if (CPDMoves.hasOwnProperty(tileID)) {
                    moveType = "CPD";
                }
            } else {
                $('#app-p' + currentPlayer + '-msg').html('Thinking!');
                if (currentPlayerType === "MM") {
                    currentAI = new Minimax(currentGame.board);
                } else if (currentPlayerType === "AB") {
                    currentAI = new ABPruning(currentGame.board);
                } else if (currentPlayerType === "EM") {
                    currentAI = new Expectiminimax(currentGame.board, currentGame.gamma);
                }

                aiThinking = true;
                move = currentAI.getMove(currentPlayer);
                tileID = move["tile"];
                moveType = move["type"];
            }
            var color = (currentPlayer === 0? '#FF0000' : '#3366FF');

            // break into coordinate for array manipulation
            var row, col;
            row = Math.floor(tileID / 6);
            col = tileID - row * 6;

            if (currentPlayer === 0 && currentGame.p1 === "HM" && currentGame.p2 === "EM") {
                if (CPDMoves.hasOwnProperty(tileID) && SABMoves.hasOwnProperty(tileID)) {
                    var str = "Are you sure to proceed with Sabotage move (success rate: " + currentGame.gamma + ")?";
                    str += "If not, this will be a Commando ParaDrop move";
                    choice = confirm(str);

                    if (choice === true) {
                        moveType = "SAB";
                    } else {
                        moveType = "CPD";
                    }
                }
            }

            var cap, i0, r0, c0;
            // process capturing for M1DB moves
            if (moveType === "M1DB") {
                currentGame.board[row][col].belongsTo = currentPlayer;
                $("#app-board").find("td#" + tileID).css('backgroundColor', color);

                cap = currentAI.capturable(tileID, currentPlayer);

                if (cap.length > 0) {
                    for (i0 = 0; i0 < cap.length; i0++) {
                        //console.log(cap[i]);
                        r0 = Math.floor(cap[i0] / 6);
                        c0 = cap[i0] - r0 * 6;

                        currentGame.board[r0][c0].belongsTo = currentPlayer;
                        $("#app-board").find("td#" + cap[i0]).css('backgroundColor', color);
                    }
                }
            } else if (moveType === "SAB") {
                // roll the dice
                var roll = Math.random();

                if (roll < currentGame.gamma) {
                    currentGame.board[row][col].belongsTo = currentPlayer;
                    $("#app-board").find("td#" + tileID).css('backgroundColor', color);

                    cap = currentAI.capturable(tileID, currentPlayer);
                    if (cap.length > 0) {
                        for (i0 = 0; i0 < cap.length; i0++) {
                            //console.log(cap[i]);
                            r0 = Math.floor(cap[i0] / 6);
                            c0 = cap[i0] - r0 * 6;

                            currentGame.board[r0][c0].belongsTo = currentPlayer;
                            $("#app-board").find("td#" + cap[i0]).css('backgroundColor', color);
                        }
                    }
                } else {
                    currentGame.board[row][col].belongsTo = currentPlayer === 0 ? 1 : 0;
                    $("#app-board").find("td#" + tileID).css('backgroundColor', (currentPlayer === 0? '#3366FF' : '#FF0000'));
                }
            } else if (moveType === "CPD") {
                currentGame.board[row][col].belongsTo = currentPlayer;
                $("#app-board").find("td#" + tileID).css('backgroundColor', color);
            }

            // update score board
            $('#app-p0-score').html(currentGame.getScore(0));
            $('#app-p1-score').html(currentGame.getScore(1));

            if (currentGame.gameOver()) {
                currentGame.printBoard();
                console.log("Game Over! Took " + Math.round((window.performance.now() - startTime)/1000) + 's.');

                if (currentGame.getScore(0) > currentGame.getScore(1)) {
                    $('#app-message').html('Player 1 won!');
                } else if (currentGame.getScore(0) < currentGame.getScore(1)) {
                    $('#app-message').html('Player 2 won!');
                } else {
                    $('#app-message').html("It's a tie!");
                }

            } else {
                console.log('Player ' + currentPlayer + ' chose tile ' + translatePosition(tileID) + ' (' + moveType + ', ' + Math.round(window.performance.now()-reTime) + 'ms, ' + currentAI.nodeExpanded + ' nodes)!');
                $('#app-p' + currentPlayer + '-msg').html('(' + new Date().timeNow() + ') I chose ' + translatePosition(tileID) + ', took me ' + Math.round(window.performance.now()-reTime) + 'ms to make that decision.');

                aiThinking = false;
                currentGame.turnCount += 1;
                currentPlayer = currentGame.turnCount % 2;
                //console.log("Player " + currentPlayer + " has next move");
                $('#app-p' + currentPlayer + '-msg').html('(' + new Date().timeNow() + ') My turn.');

                // trigger next player
                reTime = window.performance.now();
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

    startTime = window.performance.now();
    reTime = startTime;
    // this is where to trigger AI vs AI games
    if (this.p1 !== "HM") {
        $("#app-board").find("td#0").trigger('click');
    }
};
// end of Board object definition

// actual app
$(function () {
    $('#app-new').hide();
    $('#app-message').html("Choose settings then press 'Start' to play. 'New Game' to start over.");
    $('#app-start').click(function () {
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
        game.setGamma(parseFloat($('#app-gamma').val()));
        game.startGame();

        $('#app-start').hide();
        $('#app-new').show();
    });
    $('#app-new').click(function () {
        location.reload();
    });
});
// end of file
