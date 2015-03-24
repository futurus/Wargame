var MAXSCORE = 1000000;
var MINSCORE = -MAXSCORE;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
}

superAI.prototype.printBoard = function() {
    for (var row = 0; row < this.row; row++) {
        var str = '';
        for (var col = 0; col < this.col; col++) {
            //console.log(this.board[row][col].belongsTo);
            if (this.board[row][col].belongsTo === null) {
                str += ' .';
            } else {
                str += ' ' +this.board[row][col].belongsTo.toString();
            }
        }
        console.log(str);
    }
}

superAI.prototype.getScore = function () {
    var p1score = 0;
    var p2score = 0;

    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === 0) {
                p1score += this.board[row][col].value;
            } else {
                p2score += this.board[row][col].value;
            }
        }
    }
    // want to maximize own score and minimze opponent's score
    return p1score + (MAXSCORE - p2score);
}

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
}

superAI.prototype.move = function () {
    var tileID = minimax(3, 0);
    // max depth for minimax is 3
    // 0 = me, 1 = them
    return tileID;
}

superAI.prototype.getCommandoParaDropMoves = function (player) {
    var moves = [];
    // check player
    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === null) {
                if ((this.board[row][col === 0 ? 0 : col - 1].belongsTo !== player) &&
                    (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo !== player) &&
                    (this.board[row === 0 ? 0 : row - 1][col].belongsTo !== player) &&
                    (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo !== player)) {
                    moves.push([row * this.col + col, "CPD"]);
                }
            }
        }
    }

    // best moves place first
    return moves;
}

superAI.prototype.getM1DeathBlitzMoves = function (player) {
    var moves = [];
    // consider making moves an object, so
    // moves = {id1: "type", id2: "type2"}

    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === player) {
                if (this.board[row][col === 0 ? 0 : col - 1].belongsTo === null) {
                    if (moves.indexOf([row * this.col + (col === 0 ? 0 : col - 1), "M1DB"]) < 0) { // ain't work
                      moves.push([row * this.col + (col === 0 ? 0 : col - 1), "M1DB"]);
                      console.log(moves);
                    }
                }
                if (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo === null) {
                  if (moves.indexOf([row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1), "M1DB"])) {
                    moves.push([row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1), "M1DB"]);
                    console.log(moves);
                  }
                }
                if (this.board[row === 0 ? 0 : row - 1][col].belongsTo === null) {
                  if (moves.indexOf([(row === 0 ? 0 : row - 1) * this.col + col, "M1DB"])) {
                    moves.push([(row === 0 ? 0 : row - 1) * this.col + col, "M1DB"]);
                    console.log(moves);
                  }
                }
                if (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo === null) {
                  if (moves.indexOf([(row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col, "M1DB"])) {
                    moves.push([(row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col, "M1DB"]);
                    console.log(moves);
                  }
                }
            }
        }
    }

    return moves;
}

superAI.prototype.generateMoves = function (player) {
    if (tileRemain() === 0) {
        return nextMoves;
    }

    // get nextMoves, ordered by preference
    var nextMoves = getM1DeathBlitzMoves(player);
    nextMoves = nextMoves.concat(getCommandoParaDropMoves(player));
    return nextMoves;
}

superAI.prototype.getMove = function () {
    // overridden by subclasses
}

var Minimax = function (board) {
    superAI.call(this, board);
}
Minimax.prototype = Object.create(superAI.prototype);

Minimax.prototype.minimax = function (depth, who) {
    // generate moves
    var nextMoves = generateMoves();

    var bestScore = (who === 0) ? MINSCORE : MAXSCORE;
    var currentScore;
    var bestMove = -1;

    if (nextMoves.length === 0 || depth === 0) {
        bestScore = evaluate();
    } else {;
    }
}

var b = [];

for (var row = 0; row < 5; row++) {
    var r = [];
    for (var col = 0; col < 5; col++) {
        occupied = Math.random() < 0.4 ? true : false;
        if (occupied) {
            r.push(new Tile(row * 3 + col, getRandomInt(1, 100), getRandomInt(0, 1)));
        } else {
            r.push(new Tile(row * 3 + col, getRandomInt(1, 100), null));
        }
    }
    b.push(r);
}

var ai = new Minimax(b);
ai.printBoard();
console.log(ai.getScore());
console.log(ai.getCommandoParaDropMoves(0));
console.log(ai.getM1DeathBlitzMoves(0));
