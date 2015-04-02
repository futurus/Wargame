var MAXSCORE = 1000000000;
var MINSCORE = -MAXSCORE;
// TODO: is it worth converting board to 1D array?

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
    this.nodeExpanded = 0;
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

    // want to maximize own score and minimize opponent's score
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

superAI.prototype.getSabotageMoves = function (player) {
    var M1DB = this.getM1DeathBlitzMoves(player);
    var opponent = player === 0 ? 1 : 0;
    var moves = {};

    for (var row = 0; row < this.row; row++) {
        for (var col = 0; col < this.col; col++) {
            if (this.board[row][col].belongsTo === opponent) {
                // M1DB is a sure capture, it has higher priority
                if (this.board[row][col === 0 ? 0 : col - 1].belongsTo === null) {
                    if (!M1DB.hasOwnProperty((row * this.col + (col === 0 ? 0 : col - 1))) &&
                        !moves.hasOwnProperty((row * this.col + (col === 0 ? 0 : col - 1)))) {
                        moves[(row * this.col + (col === 0 ? 0 : col - 1))] = "SAB";
                    }
                }
                if (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo === null) {
                    if (!M1DB.hasOwnProperty((row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1))) &&
                        !moves.hasOwnProperty((row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1)))) {
                        moves[(row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1))] = "SAB";
                    }
                }
                if (this.board[row === 0 ? 0 : row - 1][col].belongsTo === null) {
                    if (!M1DB.hasOwnProperty(((row === 0 ? 0 : row - 1) * this.col + col)) &&
                        !moves.hasOwnProperty(((row === 0 ? 0 : row - 1) * this.col + col))) {
                        moves[((row === 0 ? 0 : row - 1) * this.col + col)] = "SAB";
                    }
                }
                if (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo === null) {
                    if (!M1DB.hasOwnProperty(((row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col)) &&
                        !moves.hasOwnProperty(((row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col))) {
                        moves[((row === this.row - 1 ? this.row - 1 : row + 1) * this.col + col)] = "SAB";
                    }
                }
            }
        }
    }

    return moves;
};

superAI.prototype.capturable = function (id, player) {
    id = parseInt(id);
    var opponent = player === 0 ? 1 : 0;
    var capturables = [];
    var row, col;
    row = Math.floor(id / this.row);
    col = id - row * this.row;

    if (this.board[row][col === 0 ? 0 : col - 1].belongsTo === opponent) {
        capturables.push((row * this.col + (col === 0 ? 0 : col - 1)));
    }
    if (this.board[row][col === this.col - 1 ? this.col - 1 : col + 1].belongsTo === opponent) {
        capturables.push((row * this.col + (col === this.col - 1 ? this.col - 1 : col + 1)));
    }
    if (this.board[row === 0 ? 0 : row - 1][col].belongsTo === opponent) {
        capturables.push(((row === 0 ? 0 : row - 1) * this.col + col));
    }
    if (this.board[row === this.row - 1 ? this.row - 1 : row + 1][col].belongsTo === opponent) {
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
        for (key in M1DB) {
         nextMoves[key] = M1DB[key];
        }
    }
    if (Object.keys(CPD).length !== 0) {
        for (key in CPD) {
            nextMoves[key] = CPD[key];
        }
    }

    return nextMoves;
};

superAI.prototype.points = function(tID, type, player) {
    var b = [];

    for (var r0 = 0; r0 < this.row; r0++) {
        var r_ = [];
        for (var c0 = 0; c0 < this.col; c0++) {
            r_.push(new Tile(this.board[r0][c0].id, this.board[r0][c0].value, this.board[r0][c0].belongsTo));
        }
        b.push(r_);
    }

    var row = Math.floor(tID / this.row);
    var col = tID - row * this.row;

    b[row][col].belongsTo = player;

    if (type === "M1DB") {
        var capturables = this.capturable(tID, player);

        if (capturables.length > 0) {
            var r, c;
            for (var id = 0; id < capturables.length; id++) {
                r = Math.floor(capturables[id] / this.row);
                c = capturables[id] - r * this.row;
                b[r][c].belongsTo = player;
            }
        }
    }

    var p1score = 0;
    var p2score = 0;

    for (row = 0; row < this.row; row++) {
        for (col = 0; col < this.col; col++) {
            if (b[row][col].belongsTo === 0) {
                p1score += parseInt(b[row][col].value);
            } else if (b[row][col].belongsTo === 1) {
                p2score += parseInt(b[row][col].value);
            }
        }
    }
    // want to maximize own score and minimize opponent's score
    return p1score + (-p2score);
};

superAI.prototype.reorderMoves = function(player) {
    var nextMoves = this.generateMoves(player);
    var moves = [];
    var tID, point;

    if (nextMoves.length !== 0) {
        for (tID in nextMoves) {
            point = parseInt(this.points(tID, nextMoves[tID], player));
            moves.push({tile: parseInt(tID), type: nextMoves[tID], zscore: point});
        }

        var inc = moves.slice(0);
        var dec = moves.slice(0);

        if (player === 0) {
            return dec.sort(function (a, b) { if (a.zscore >= b.zscore) { return -1; } else { return 1 }});
        } else {
            return inc.sort(function (a, b) { if (a.zscore <= b.zscore) { return -1; } else { return 1 }});
        }
    }

    return moves;
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
    this.nodeExpanded += 1;
    var nextMoves = this.generateMoves(player);
    var bestScore = (player === 0) ? MINSCORE : MAXSCORE;
    var opponent = player === 0 ? 1 : 0;
    var currentScore;
    var bestMove = -1;
    var cap = [];
    var moveType;

    if (Object.keys(nextMoves).length === 0 || depth === 0) {
        bestScore = this.getScore();
    } else {
        var row, col, tID, index, type;

        for (tID in nextMoves) {
            type = nextMoves[tID];
            var capturables = [];
            row = Math.floor(tID / this.row);
            col = tID - row * this.row;

            this.board[row][col].belongsTo = player;
            if (type === "M1DB") {
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

            currentScore = parseInt(this.minimax(depth - 1, opponent)["score"]);

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

            if (player === 0) {
                // player 0 is maximizing
                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    moveType = type;
                    cap = capturables;
                }
            } else {
                // player 1 is minimizing
                if (currentScore < bestScore) {
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    moveType = type;
                    cap = capturables;
                }
            }
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


var ABPruning = function (board) {
    Minimax.call(this, board);
};
ABPruning.prototype = Object.create(Minimax.prototype);


ABPruning.prototype.alphabeta = function (depth, alpha, beta, player) {
    // generate moves

    this.nodeExpanded += 1;
    var nextMoves = this.reorderMoves(player);
    var bestScore = (player === 0) ? MINSCORE : MAXSCORE;
    var opponent = player === 0 ? 1 : 0;
    var currentScore;
    var bestMove = -1;
    var cap = [];
    var moveType;

    if (Object.keys(nextMoves).length === 0 || depth === 0) {
        bestScore = this.getScore();
    } else {
        var row, col, tID, index, type;

        for (index = 0; index < nextMoves.length; index++) {
            tID = (nextMoves[index])['tile'];
            type = (nextMoves[index])['type'];
            var capturables = [];
            row = Math.floor(tID / this.row);
            col = tID - row * this.row;
            var r, c, id;

            this.board[row][col].belongsTo = player;
            if (type === "M1DB") {
                capturables = this.capturable(tID, player);
                // capture if M1DB move
                if (capturables.length > 0) {
                    for (id = 0; id < capturables.length; id++) {
                        r = Math.floor(capturables[id] / this.row);
                        c = capturables[id] - r * this.row;
                        this.board[r][c].belongsTo = player;
                    }
                }
            }

            currentScore = parseInt(this.alphabeta(depth - 1, alpha, beta, opponent)["score"]);

            // undo moves: including capture moves
            if (capturables.length > 0) {
                for (id = 0; id < capturables.length; id++) {
                    r = Math.floor(capturables[id] / this.row);
                    c = capturables[id] - r * this.row;
                    this.board[r][c].belongsTo = (player + 1) % 2;
                }
            }
            this.board[row][col].belongsTo = null;

            if (player === 0) {
                // player 0 is maximizing
                if (currentScore > bestScore) {
                    alpha = currentScore;
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    moveType = type;
                    cap = capturables;
                }
                if (beta <= alpha) {
                    //console.log("skipping player 0, a: " + alpha + ", b: " + beta);
                    break;
                }
            } else {
                // player 1 is minimizing
                if (currentScore < bestScore) {
                    beta = currentScore;
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    moveType = type;
                    cap = capturables;
                }
                if (beta <= alpha) {
                    //console.log("skipping player 1, a: " + alpha + ", b: " + beta);
                    break;
                }
            }
        }
    }

    return {
        "tile": bestMove,
        "score": bestScore,
        "type": moveType,
        "capture": cap
    };
};

ABPruning.prototype.getMove = function (player) {
    var best = this.alphabeta(5, MINSCORE, MAXSCORE, player);

    // max depth for minimaxAB is 5
    // 0 = me, 1 = them
    return best;
};


var Expectiminimax = function (board, gamma) {
    Minimax.call(this, board);
    this.gamma = gamma;
};
Expectiminimax.prototype = Object.create(Minimax.prototype);

Expectiminimax.prototype.generateMoves = function (player) {
    var nextMoves = {};
    var key;

    if (this.tileRemain() === 0) {
        return nextMoves;
    }

    // get nextMoves, ordered by preference
    var M1DB = this.getM1DeathBlitzMoves(player);
    var SAB = this.getSabotageMoves(player);
    var CPD = this.getCommandoParaDropMoves(player);

    if (Object.keys(M1DB).length !== 0) {
        for (key in M1DB) {
            nextMoves[key] = M1DB[key];
        }
    }
    if (Object.keys(SAB).length !== 0) {
        for (key in SAB) {
            if (!nextMoves.hasOwnProperty(key)) {
                nextMoves[key] = SAB[key];
            }
        }
    }
    if (Object.keys(CPD).length !== 0) {
        for (key in CPD) {
            if (nextMoves.hasOwnProperty(key) && SAB.hasOwnProperty(key)) {
                nextMoves[key] = [SAB[key], CPD[key]];
            } else {
                nextMoves[key] = ["PLCHOLDER", CPD[key]];
            }
        }
    }
    return nextMoves;
};


Expectiminimax.prototype.expectiminimax = function (depth, player) {
    //console.log('In minimax, depth: ' + depth + ' for player ' + player);
    // generate moves
    this.nodeExpanded += 1;
    var nextMoves = this.generateMoves(player);
    var bestScore = (player === 0) ? MINSCORE : MAXSCORE;
    var opponent = player === 0 ? 1 : 0;
    var currentScore;
    var bestMove = -1;
    var cap = [];
    var moveType;

    if (Object.keys(nextMoves).length === 0 || depth === 0) {
        bestScore = this.getScore();
    } else {
        var row, col, tID, id, r, c;

        for (tID in nextMoves) {
            var capturables = [];
            row = Math.floor(tID / this.row);
            col = tID - row * this.row;

            if (Array.isArray(nextMoves[tID]) && nextMoves[tID][0] === "SAB") { // check sabotage
                // success
                this.board[row][col].belongsTo = player;
                capturables = this.capturable(tID, player);

                // capture if M1DB move
                if (capturables.length > 0) {
                    for (id = 0; id < capturables.length; id++) {
                        r = Math.floor(capturables[id] / this.row);
                        c = capturables[id] - r * this.row;
                        this.board[r][c].belongsTo = player;
                    }
                }

                currentScore = this.gamma * parseInt(this.expectiminimax(depth - 1, opponent)["score"]);

                if (capturables.length > 0) {
                    for (id = 0; id < capturables.length; id++) {
                        r = Math.floor(capturables[id] / this.row);
                        c = capturables[id] - r * this.row;
                        this.board[r][c].belongsTo = (player + 1) % 2;
                    }
                }
                capturables = []; // reset capturables so it doesn't interfere with M1DB undo moves
                this.board[row][col].belongsTo = null;

                // failure
                this.board[row][col].belongsTo = opponent;

                currentScore = (1.0 - this.gamma) * parseInt(this.expectiminimax(depth - 1, opponent)["score"]);

                this.board[row][col].belongsTo = null;

                if (player === 0) {
                    // player 0 is maximizing
                    if (currentScore > bestScore) {
                        bestScore = currentScore;
                        bestMove = parseInt(tID);
                        moveType = nextMoves[tID][0];
                        cap = capturables;
                    }
                } else {
                    // player 1 is minimizing
                    if (currentScore < bestScore) {
                        bestScore = currentScore;
                        bestMove = parseInt(tID);
                        moveType = nextMoves[tID][0];
                        cap = capturables;
                    }
                }
            } // end of sabotage check

            // check M1DB and CPD moves as usual
            this.board[row][col].belongsTo = player;
            if (nextMoves[tID] === "M1DB") {
                capturables = this.capturable(tID, player);
                // capture if M1DB move
                if (capturables.length > 0) {
                    for (id = 0; id < capturables.length; id++) {
                        r = Math.floor(capturables[id] / this.row);
                        c = capturables[id] - r * this.row;
                        this.board[r][c].belongsTo = player;
                    }
                }
            }

            currentScore = parseInt(this.expectiminimax(depth - 1, opponent)["score"]);

            // undo moves: including capture moves
            if (capturables.length > 0) {
                for (id = 0; id < capturables.length; id++) {
                    r = Math.floor(capturables[id] / this.row);
                    c = capturables[id] - r * this.row;
                    this.board[r][c].belongsTo = (player + 1) % 2;
                }
            }
            this.board[row][col].belongsTo = null;

            if (player === 0) {
                // player 0 is maximizing
                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    if (nextMoves[tID] === "M1DB") {
                        moveType = nextMoves[tID];
                    } else {
                        moveType = nextMoves[tID][1];
                    }
                    cap = capturables;
                }
            } else {
                // player 1 is minimizing
                if (currentScore < bestScore) {
                    bestScore = currentScore;
                    bestMove = parseInt(tID);
                    if (nextMoves[tID] === "M1DB") {
                        moveType = nextMoves[tID];
                    } else {
                        moveType = nextMoves[tID][1];
                    }
                    cap = capturables;
                }
            }
        }
    }

    return {
        "tile": bestMove,
        "score": bestScore,
        "type": moveType,
        "capture": cap
    };
};

Expectiminimax.prototype.getMove = function (player) {
    var best = this.expectiminimax(3, player);
    // max depth for expectiminimax is 3
    // 0 = me, 1 = them
    return best;
};


//testing goes here
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
