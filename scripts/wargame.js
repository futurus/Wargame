// YOUR CODE GOES HERE
var aiThinking = false;

var Game = function(p1, p2) {
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

//Game.prototype.getBoard = function() {
//  var out = [];
//  for (var row = 0; row < 6; row++) {
//    for (var col = 0; col < 6; col++) {
//      out.push(new Tile((row * 6 + col), $("#app-board").find("td#" + (row * 6 + col)).html(), null));
//    }
//  }
//
//  this.board = out;
//}

Game.prototype.gameOver = function() {
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (this.board[row][col].belongsTo === null) {
                return false;
            }
        }
    }

	return true;
};

Game.prototype.goLive = function() {
	var currentGame = this; // grab a hold of this

	$('.tile').click(function () {
		var id = $(this).attr('id');
        var row, col;

		if (currentGame.turnCount % 2 == 0) { // player 1
			if (!aiThinking) {
				$(this).css('backgroundColor', '#FF0000');
                row = Math.floor(id/6);
                col = id - row * 6;
                console.log('tile ' + id + ' (row: ' + row + ', col: ' + col + ' clicked!');
                currentGame.board[row][col].belongsTo = 0;

				// trigger AI's move
                var move;
				aiThinking = true;
                console.log('thinking');
                var ai = new Minimax(currentGame.board);
                currentGame.turnCount += 1; //give turn to p2
                move = ai.getMove(currentGame.turnCount)["tile"];
                row = Math.floor(move/6);
                col = move - row * 6;
                console.log('AI chose tile ' + move + ' (row: ' + row + ', col: ' + col + ' clicked!');
                currentGame.board[row][col].belongsTo = 1;
                $("#app-board").find("td#" + move).css('backgroundColor', '#3366FF');
                currentGame.turnCount += 1; // give turn to p1
                aiThinking = false;
                console.log('done thinking');
				//$("#app-board").find("td#" + move).trigger('click');
			} else {
				$('#app-message').html(currentGame.p2 + ' has not completed her move. Please wait!');
			}

		}

		if (currentGame.gameOver()) {
			$('#app-message').html('You won!');
		}
	});
};

Game.prototype.startGame = function() {
	// Add the event listeners
	this.goLive();
    $('#app-message').html('Game between ' + this.p1 + ' and ' + this.p2 + ' started!');
};
// end of Board object definition

// actual app
$(function() {
	$('#app-button').click(function() {
		var p1 = $('#app-player1').val();
		var p2 = $('#app-player2').val();

		var game = new Game(p1, p2);
		game.startGame();
	});
});
// end of file
