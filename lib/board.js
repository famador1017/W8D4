let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = Array.from({length: 8}, () => Array.from({length: 8}))

  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  
  return grid;
 }

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  // is a piece at this position
  if (!this.isValidPos(pos)) {
    throw new Error('Not valid pos!');
  }
  return this.grid[pos[0]][pos[1]]
 
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (!this.isOccupied(pos)) {
    return false;
    };
  return this.getPiece(pos).color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return !!this.getPiece(pos);
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove('white') && !this.hasMove('black')
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  // pos could be [4, 4] but not [-1, 8]
  // both numbers have to be (0...7)
  return ((pos[0] >= 0 && pos[0] < 8) && (pos[1] >= 0 && pos[1] < 8));
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip = []) {
  // recursively call it if the next piece in that direction is oppColor
  // base cases: 
  //    if it hits an empty pos,
  let nextPos = [pos[0]+ dir[0], pos[1] + dir[1]];
  // BASE CASE:
  //    if it hits the edge of the board
  //    if it hits a piece of the same color
  if (!board.isValidPos(nextPos)) {
    return null;
  } else if (!board.isOccupied(nextPos)) {
    return null;
  } else if (piecesToFlip.length === 0 && board.isMine(nextPos, color)){
    return null;
  } else if (board.isMine(nextPos, color)) {
    return piecesToFlip;
  } else {
    // RECURSIVE STEP:
    piecesToFlip.push(nextPos)
    //  otherwise, recursive step.
    //  and we're passing the array piecesToFlip back up the chain 
    return _positionsToFlip(board, nextPos, color, dir, piecesToFlip) 
  }
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  // let potentialMoves = this.validMove(pos, color);
  if (!this.validMove(pos, color)) {
      throw new Error("Invalid Move");
  }
  this.grid[pos[0]][pos[1]] = new Piece(color);

  let toFlipArray = [];
  for (let i = 0; i < Board.DIRS.length; i++) {
    let direction = Board.DIRS[i];
    const position = _positionsToFlip(this, pos, color, direction);
    if (position) {
      toFlipArray.push(...position);
    }
  }
  // toFlipArray.forEach(el => {
  //   this.getPiece(el).flip();
  // })

  for (let index = 0; index < toFlipArray.length; index++) {
    this.getPiece(toFlipArray[index]).flip();
  }

};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }

  for (let i = 0; i < Board.DIRS.length; i++) {
    let direction = Board.DIRS[i];
    const position = _positionsToFlip(this, pos, color, direction);
    if (position) {
      return true;
    }
  } 
  // empty space: isOccupied
  // returns boolean
  // go through all the Board.DIRS and call _positionsToFlip
  // if any of these _positionsToFlip are true, return true 
  // else return false
  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const validMovesList = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let position = [i, j];
      if(this.validMove(position, color)) {
          validMovesList.push(position);
      }
    }
  }
  return validMovesList;
};


module.exports = Board;
