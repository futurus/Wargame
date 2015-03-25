// YOUR CODE GOES HERE
var aiThinking = false;

// consider changing Board to Game
// defind the Board object
var Board = function(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
  // needs to hold the array representation of the current board so AI could get next move from board
  this.board = null;
	this.turnCount = 0;
};

Board.prototype.getBoard = function() {
  var out = [];
  for (var row = 0; row < 6, row++) {
    for (var col = 0; col < 6, col++) {
      out.push(new Tile((row * 6 + col), $("#app-board").find("td#" + (row * 6 + col)).val()));
    }
  }
  this.board = out;
}

Board.prototype.populate = function() {
	// declare variables
	var i,
			numOfTiles = 36;

	// initialize tiles
	for (i = 0; i < numOfPairs; i++){
		var tile = new Tile(i, 1);	this.tiles.push(tile);
	}
};

Board.prototype.checkWin = function() {
	var i;

	return false;
};

Board.prototype.goLive = function() {
	var cBoard = this; // grab a hold of this
	var match = 0;

	$('.tile').click(function () {
		cBoard.turnCount += 1; // move this to its rightful place
		var id = $(this).attr('id');
		//console.log(id);
		console.log(cBoard.turnCount);

		if (cBoard.turnCount % 2 == 1) { // player 1
			if (!aiThinking) {
				$(this).css('backgroundColor', '#FF0000');

				// trigger AI's move
				aiThinking = true;
				move = getRandomInt(1, 36);
				$("#app-board").find("td#" + move).trigger('click');
			} else {
				$('#app-message').html(cBoard.p2 + ' has not completed her move. Please wait!');
			}

		} else { // player 2
			setTimeout(function() {
				$("#app-board").find("td#" + id).css('backgroundColor', '#6699FF');
				$('#app-message').html(cBoard.p2 + ' has chosen ' + id);
				aiThinking = false;
			}, 1000);
		}

		if (cBoard.checkWin()) {
			$('#app-message').html('You won!');
		}
	});
};

Board.prototype.draw = function() {
	// Add the event listeners
	this.goLive();
};
// end of Board object definition

// actual app
$(function() {
	$('#app-button').click(function() {
		var p1 = $('#app-player1').val();
		var p2 = $('#app-player2').val();
		var board = new Board(p1, p2);

		//board.populate();
		board.draw();
		console.log(board.turnCount);
		console.log(aiThinking);
		$('#app-message').html('Game between ' + p1 + ' and ' + p2 + ' started!');
	});
});
// end of file
