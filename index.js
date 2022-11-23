// a 2d vector class that can hold 2 object on x and y variable
class vec2 {
	// constructior of this 2d vector class to create object of it
	constructor ( x, y ) {
		this.x = x
		this.y = y
	}
}

// a class cell wich will represent the cell on the game
class cell {
	// constructor of this class to create a object of it
	constructor ( pos ) {
		this.pos = new vec2 ( pos.x, pos.y )
	}
}

// this are the global variables to use and share information
// between the function so that they can operate and run fast
// global variables
var can_reset
var grid_size, cell_size
var canvas, context
var grid, snake, food
var snake_dir
var score

// this function checks if a cell is under the snake or not
// if that cell is under the snake then it return true
// otherwise it return false this is used to detect
// the food conjumption by the snake
function collition_with_snake ( pos ) {
	var elem = snake.find ( function (element) {
		return (element.x == pos.x && element.y == pos.y)
	} )
	if ( elem == undefined ) return new Boolean(false)
	else return new Boolean(true)
}

// this function move the snake forward by the direction
// currently it's facing so that the game keep playing
// and it also checks if snake needs to be wrapped around like
// if snake goes through any side of the canvas it appears
// on the opposite side of it
function move_snake () {
	snake = snake.slice ( 1 )
	var cp = snake[snake.length - 1]
	var next = new vec2 (
		parseInt ( cp.x + snake_dir.x ),
		parseInt ( cp.y + snake_dir.y )
	)
	if ( next.x < 0 ) next.x = parseInt ( grid_size.x - 1 )
	if ( next.x >= grid_size.x ) next.x = parseInt ( 0 )
	if ( next.y < 0 ) next.y = parseInt ( grid_size.y - 1 )
	if ( next.y >= grid_size.y ) next.y = parseInt ( 0 )
	var ret = collition_with_snake ( next )
	snake.push ( next )
	return ret
}

// this function used to draw the cells on the canvas for debugging purpose
function draw_grid () {
	for ( let i = 0 ; i < grid_size.x ; ++i ) {
		for ( let j = 0 ; j < grid_size.y ; ++j ) {
			context.strokeRect ( grid[i][j].pos.x, grid[i][j].pos.y,
				cell_size.x, cell_size.y )
		}
	}
}

// this function goes through all the cells of the snake and
// draws them on the screen in color 'BLUE'
function draw_snake () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "Blue"
	for ( let i = 0 ; i < snake.length ; ++i ) {
		var cp = snake[i]
		context.fillRect ( grid[cp.x][cp.y].pos.x, grid[cp.x][cp.y].pos.y,
			cell_size.x, cell_size.y )
	}
}

// this function simply draw the food in color 'RED' on the screen
function draw_food () {
	context.fillStyle = "Red"
	context.fillRect ( grid[food.x][food.y].pos.x, grid[food.x][food.y].pos.y,
		cell_size.x, cell_size.y )
}

// this function draw the current score of the player
// on the top left corner of the canvas in color 'GREEN'
function draw_score () {
	context.fillStyle = "Green"
	context.font = "30px Arial";
	context.fillText( parseInt(score).toString(), 10, 30);
}

// this function is used to divide the canvas in reasonable sizes
// 2d grid of cell to used to show the snake food and debugging
function populate_grid () {
	var cur_pos = new vec2 ( 0, 0 )
	grid = []
	for ( let i = 0 ; i < grid_size.x ; ++i ) {
		var row = []
		for ( let j = 0 ; j < grid_size.y ; ++j ) {
			row[j] = new cell ( new vec2 ( cur_pos.x, cur_pos.y ) )
			cur_pos.x = parseInt ( cur_pos.x + cell_size.x )
		}
		grid[i] = row
		cur_pos.x = parseInt ( 0 )
		cur_pos.y = parseInt ( cur_pos.y + cell_size.y )
	}
}

// this function populate the initial snake of size 5
// on the center of the screen
function populate_snake () {
	snake = []
	for ( let i = 0 ; i < 5 ; ++i )
		snake.push ( new vec2 ( parseInt(grid_size.x/2), parseInt(grid_size.y/2 + i) ) )
}

// this function puts food on a random position on the grid
// whenever this function is called
function populate_food () {
	food = new vec2 (
		Math.floor ( Math.random() * grid_size.x ),
		Math.floor ( Math.random() * grid_size.y )
	)
}

// this functin automatically called when the browser window is resized so
// that our game is interactive and dynamic
function resize_function ( event ) {
	canvas.width = parseInt ( window.innerWidth * (95.0 / 100.0) )
	canvas.height = parseInt ( window.innerHeight * (95.0 / 100.0) )
}

// this functin handles the keypress like the arrow key change the
// direction of the snake, the r key reset the game when game is
// over etc.
function key_pressed ( event ) {
	switch ( event.keyCode ) {
		case 37: // up arrow key
			if ( parseInt(snake_dir.y) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(0), parseInt(-1) )
			}
			break;
		case 38: // left arrow key
			if ( parseInt(snake_dir.x) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(-1), parseInt(0) )
			}
			break;
		case 39: // down arrow key
			if ( parseInt(snake_dir.y) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(0), parseInt(1) )
			}
			break;
		case 40: // right arrow key
			if ( parseInt(snake_dir.x) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(1), parseInt(0) )
			}
			break;
		case 82: // 'r' key to reset the game when game is over
			if ( can_reset == Boolean ( true ) ) {
				can_reset = new Boolean ( false )
				score = parseInt ( 0 )
				resize_function ()
				populate_grid ()
				populate_snake ()
				populate_snake ()
				window.requestAnimationFrame ( next_frame )
			}
			break;
	}
}

// this is out main game loop function
// frame_skipped variable is used to slow down the simulation
// because this fame runs fast
var frame_skipped = parseInt ( 0 )
function next_frame ( timestamp ) {
	// here if we haven't skipped 5 frames then we need to skip this frame
	// otherwise this frame will be simulated and frame skipped will be 0
	if ( frame_skipped < parseInt ( 6 ) ) {
		frame_skipped += 1
		window.requestAnimationFrame ( next_frame )
		return
	} else {
		frame_skipped = parseInt ( 0 )
	}
	// sh holds the head position of the snake
	var sh = snake[snake.length - 1]
	// checking if food and snake head is in same position
	// if so then collct food update score and generate new food
	if ( sh.x == food.x && sh.y == food.y ) {
		snake = [snake[0]].concat ( snake )
		populate_food ()
		score = parseInt ( score + 1 )
	}
	// cheching if snake hit itself if so then game needs to be over
	var found = move_snake ()
	// doing all the drawing
	draw_snake ()
	draw_food ()
	draw_score ()
	// if snake didn't hit itself then continue game
	// otherwise game needs to be over
	if ( found != Boolean ( true ) ) {
		window.requestAnimationFrame ( next_frame )
	} else {
		can_reset = new Boolean ( true )
	}
}

// this function is called when the page is loaded fully on the
// browse, it sets the necessary variables so that the app can
// operate without any erroes
// also this function start the initial game
function loaded_function () {
	score = parseInt ( 0 )
	can_reset = new Boolean ( false )
	snake_dir = new vec2 ( 0, 1 )
	cell_size = new vec2 ( 32, 32 )
	canvas = document.getElementById ( "myCanvas" )
	context = canvas.getContext ( "2d" )
	resize_function ()
	grid_size = new vec2 (
		parseInt ( canvas.height / cell_size.x ),
		parseInt ( canvas.width / cell_size.y )
	)
	populate_grid ()
	populate_snake ()
	populate_food ()
	draw_snake ()
	draw_food ()
	// starting the game simulation
	window.requestAnimationFrame ( next_frame )
}

// hooking up some function to brower engine so that they called automatically
// to handle some event s like resize the window, key press, onload the page etc
window.onload = loaded_function
window.addEventListener ( 'resize', resize_function )
document.onkeydown = key_pressed
