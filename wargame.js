// YOUR CODE GOES HERE
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var aiThinking = false;
// defind the Tile object
var Tile = function(id, value) {
	this.id = id;
	this.value = value;
	this.belongsTo = null;
};
// end of Tile object definition

// defind the Board object
var Board = function(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
	this.p1tiles = [];
	this.p2tiles = [];
	this.turnCount = 0;

};

Board.prototype.p1score = 0;
Board.prototype.p2score = 0;

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
		cBoard.turnCount += 1;
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
