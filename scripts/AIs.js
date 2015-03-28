var MAXSCORE = 1000000000;
var MINSCORE = -MAXSCORE;

// generating random moves
//function getRandomInt(min, max) {
//    return Math.floor(Math.random() * (max - min + 1)) + min;
//}

// defind the Tile object
var Tile = function (id, value, player) {
    this.id = id;
    this.value = value;
    this.belongsTo = player;
};
// end of Tile object definition

var superAI = function (board) {
    this.board = board; // 2d array of Tiles
    this.row = board.length;
    this.col = board[0].length;
};

superAI.prototype.printBoard = function () {
    for (var row = 0; row < this.row; row++) {
        var str = '';
        for (var col = 0; col < this.col; col++) {
            //console.log(this.board[row][col].belongsTo);
            if (this.board[row][col].belongsTo === null) {
                str += ' .';
            } else {
                str += ' ' + this.board[row][col].belongsTo.toString();
            }
        }
        console.log(str);
    }
};

superAI.prototype.getScore = function () {
    var p1score = 0;
    var p2score = 0;

    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === 0) {
                p1score += parseInt(this.board[row][col].value);
            } else if (this.board[row][col].belongsTo === 1) {
                p2score += parseInt(this.board[row][col].value);
            }
        }
    }
    //console.log('p1: ' + p1score + ', p2: ' + p2score);
    // want to maximize own score and minimze opponent's score
    return p1score + (-p2score);
};

superAI.prototype.tileRemain = function () {
    var remain = 0;
    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === null) {
                remain += 1;
            }
        }
    }
    return remain;
};

superAI.prototype.getCommandoParaDropMoves = function (player) {
    var moves = {};
    // check player
    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === null) {
                if ((this.board[row][col === 0 ? 0 : col - 1].belongsTo !== player) &&
                    (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo !== player) &&
                    (this.board[row === 0 ? 0 : row - 1][col].belongsTo !== player) &&
                    (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo !== player)) {
                    moves[row * this.col + col] = "CPD";
                }
            }
        }
    }

    // best moves place first
    // possibly do {id: score if move made}
    return moves;
};

superAI.prototype.getM1DeathBlitzMoves = function (player) {
    var moves = {};
    // consider making moves an object, so
    // moves = {id1: "type", id2: "type2"}
    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === player) {
                if (this.board[row][col === 0 ? 0 : col - 1].belongsTo === null) {
                    if (!moves.hasOwnProperty((row * this.col + (col === 0 ? 0 : col - 1)))) {
                        moves[(row * this.col + (col === 0 ? 0 : col - 1))] = "M1DB";
                    }
                }
                if (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo === null) {
                    if (!moves.hasOwnProperty((row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1)))) {
                        moves[(row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1))] = "M1DB";
                    }
                }
                if (this.board[row === 0 ? 0 : row - 1][col].belongsTo === null) {
                    if (!moves.hasOwnProperty(((row === 0 ? 0 : row - 1) * this.col + col))) {
                        moves[((row === 0 ? 0 : row - 1) * this.col + col)] = "M1DB";
                    }
                }
                if (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo === null) {
                    if (!moves.hasOwnProperty(((row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col))) {
                        moves[((row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col)] = "M1DB";
                    }
                }
            }
        }
    }
    // possibly do {id: score if move made}
    return moves;
};

superAI.prototype.capturable = function (id, player) {
    id = parseInt(id);
    var capturables = [];
    var row, col;
    row = Math.floor(id / this.row);
    col = id - row * this.row;

    if (this.board[row][col === 0 ? 0 : col - 1].belongsTo === ((player + 1 ) % 2)) {
        capturables.push((row * this.col + (col === 0 ? 0 : col - 1)));
    }
    if (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo === ((player + 1 ) % 2)) {
        capturables.push((row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1)));
    }
    if (this.board[row === 0 ? 0 : row - 1][col].belongsTo === ((player + 1 ) % 2)) {
        capturables.push(((row === 0 ? 0 : row - 1) * this.col + col));
    }
    if (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo === ((player + 1 ) % 2)) {
        capturables.push(((row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col));
    }
    return capturables;
};

superAI.prototype.generateMoves = function (player) {
    var nextMoves = {};
    var key;

    if (this.tileRemain() === 0) {
        return nextMoves;
    }

    // get nextMoves, ordered by preference
    var M1DB = this.getM1DeathBlitzMoves(player);
    var CPD = this.getCommandoParaDropMoves(player);
    if (Object.keys(M1DB).length !== 0) {
        var keys = Object.keys(M1DB);
        for (key in Object.keys(M1DB)) {
         nextMoves[keys[key]] = M1DB[keys[key]];
        }
    }
    if (Object.keys(CPD).length !== 0) {
        var keys = Object.keys(CPD);
        for (key in Object.keys(CPD)) {
            nextMoves[keys[key]] = CPD[keys[key]];
        }
    }

    return nextMoves;
};

superAI.prototype.getMove = function () {
    // overridden by subclasses
};

var Minimax = function (board) {
    superAI.call(this, board);
};
Minimax.prototype = Object.create(superAI.prototype);

Minimax.prototype.minimax = function (depth, player) {
    //console.log('In minimax, depth: ' + depth + ' for player ' + player);
    // generate moves
    var nextMoves = this.generateMoves(player);
    var bestScore = (player === 0) ? MINSCORE : MAXSCORE;
    var currentScore;
    var bestMove = -1;
    var cap = [];
    var moveType;

    if (Object.keys(nextMoves).length === 0 || depth === 0) {
        bestScore = this.getScore();
    } else {
        var row, col, tID;

        for (tID in nextMoves) {
            var capturables = [];
            row = Math.floor(tID / this.row);
            col = tID - row * this.row;

            this.board[row][col].belongsTo = player;
            if (nextMoves[tID] === "M1DB") {
                capturables = this.capturable(tID, player);
                // capture if M1DB move
                if (capturables.length > 0) {
                    var r, c;
                    for (var id = 0; id < capturables.length; id++) {
                        r = Math.floor(capturables[id] / this.row);
                        c = capturables[id] - r * this.row;
                        this.board[r][c].belongsTo = player;
                    }
                }
            }

            if (player === 0) {
                // player 0 is maximizing
                currentScore = parseInt(this.minimax(depth - 1, 1)["score"]);
                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    moveType = nextMoves[tID];
                    cap = capturables;
                }
            } else {
                // player 1 is minimizing
                currentScore = parseInt(this.minimax(depth - 1, 0)["score"]);
                //console.log(this.minimax(depth - 1, 0));
                if (currentScore < bestScore) {
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    moveType = nextMoves[tID];
                    cap = capturables;
                }
            }

            // undo moves: including capture moves
            if (capturables.length > 0) {
                var r, c;
                for (var id = 0; id < capturables.length; id++) {
                    r = Math.floor(capturables[id] / this.row);
                    c = capturables[id] - r * this.row;
                    this.board[r][c].belongsTo = (player + 1) % 2;
                }
            }
            this.board[row][col].belongsTo = null;
        }
    }

    return {
        "tile": bestMove,
        "score": bestScore,
        "type": moveType,
        "capture": cap
    };
};

Minimax.prototype.getMove = function (player) {
    var best = this.minimax(3, player);
    // max depth for minimax is 3
    // 0 = me, 1 = them
    return best;
};

// testing goes here
//var b = [];
//
//for (var row = 0; row < 5; row++) {
//    var r = [];
//    for (var col = 0; col < 5; col++) {
//        occupied = Math.random() < 0.4 ? true : false;
//        if (occupied) {
//            r.push(new Tile(row * 3 + col, getRandomInt(1, 100), getRandomInt(0, 1)));
//        } else {
//            r.push(new Tile(row * 3 + col, getRandomInt(1, 100), null));
//        }
//    }
//    b.push(r);
//}
//
//var ai = new Minimax(b);
//ai.printBoard();
//console.log(ai.getScore());
//console.log(ai.getMove(0));
