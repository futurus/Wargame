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
        var id = $(this).attr('id');
        var row, col;
        row = Math.floor(id / 6);
        col = id - row * 6;
        console.log('tile ' + id + ' (row: ' + row + ', col: ' + col + ') clicked!');
        //console.log(aiThinking);

        if (currentGame.turnCount % 2 == 0) { // player 1
            if (!aiThinking && currentGame.board[row][col].belongsTo === null) {
                // human player processing
                if (currentGame.p1 === "HM") {
                    var human = new superAI(currentGame.board);
                    var M1DBMoves = human.getM1DeathBlitzMoves(0);
                    console.log(M1DBMoves);
                    $(this).css('backgroundColor', '#FF0000');
                    currentGame.board[row][col].belongsTo = 0;
                    // capture tiles for M1DB moves

                    if (M1DBMoves.hasOwnProperty(id)) {
                        var cap = human.capturable(id, 0);
                        console.log(cap);
                        if (cap.length > 0) {
                            for (var i0 = 0; i0 < cap.length; i0++) {
                                //console.log(cap[i]);
                                var r0 = Math.floor(cap[i0] / 6);
                                var c0 = cap[i0] - r0 * 6;
                                //console.log('r: ' + r + ', c: ' + c);

                                currentGame.board[r0][c0].belongsTo = 0;
                                $("#app-board").find("td#" + cap[i0]).css('backgroundColor', '#FF0000');
                            }
                        }
                    }
                }
                $('#app-p1-score').html(currentGame.getScore(currentGame.turnCount % 2));

                // trigger AI's move
                var move, tile, captures;
                aiThinking = true;
                console.log('thinking');
                var ai = new Minimax(currentGame.board);
                currentGame.turnCount += 1; //give turn to p2
                move = ai.getMove(1);
                tile = move["tile"];
                captures = move["capture"];
                //console.log(move);

                row = Math.floor(tile / 6);
                col = tile - row * 6;

                console.log('AI chose tile ' + tile + ' (row: ' + row + ', col: ' + col + ') clicked!');
                currentGame.board[row][col].belongsTo = 1;
                $("#app-board").find("td#" + tile).css('backgroundColor', '#3366FF');

                if (captures.length > 0) {
                    for (var i1 = 0; i1 < captures.length; i1++) {
                        //console.log(captures[i]);
                        var r1 = Math.floor(captures[i1] / 6);
                        var c1 = captures[i1] - r1 * 6;
                        //console.log('r: ' + r + ', c: ' + c);

                        currentGame.board[r1][c1].belongsTo = 1;
                        $("#app-board").find("td#" + captures[i1]).css('backgroundColor', '#3366FF');
                    }
                }
                currentGame.turnCount += 1; // give turn to p1
                aiThinking = false;
                $('#app-p2-score').html(currentGame.getScore(1));
                console.log('done thinking');
                //$("#app-board").find("td#" + move).trigger('click');
            } else {
                $('#app-message').html(currentGame.p2 + ' has not completed her move. Please wait!');
            }

        }

        if (currentGame.gameOver()) {
            if (currentGame.getScore(0) > currentGame.getScore(1)) {
                $('#app-message').html(currentGame.p1 + ' won!');
            } else {
                $('#app-message').html(currentGame.p2 + ' won!');
            }
        }
    });
};

Game.prototype.startGame = function () {
    // Add the event listeners
    this.goLive();
    $('#app-message').html('Game between ' + this.p1 + ' and ' + this.p2 + ' started!');
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
