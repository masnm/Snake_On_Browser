class vec2 {
	constructor ( x, y ) {
		this.x = x
		this.y = y
	}
}

class cell {
	constructor ( pos ) {
		this.pos = new vec2 ( pos.x, pos.y )
	}
}

// global variables
var can_reset
var grid_size, cell_size
var canvas, context
var grid, snake, food
var snake_dir
var score

function collition_with_snake ( pos ) {
	var elem = snake.find ( function (element) {
		return (element.x == pos.x && element.y == pos.y)
	} )
	if ( elem == undefined ) return new Boolean(false)
	else return new Boolean(true)
}

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

function draw_grid () {
	for ( let i = 0 ; i < grid_size.x ; ++i ) {
		for ( let j = 0 ; j < grid_size.y ; ++j ) {
			context.strokeRect ( grid[i][j].pos.x, grid[i][j].pos.y,
				cell_size.x, cell_size.y )
		}
	}
}

function draw_snake () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "Blue"
	for ( let i = 0 ; i < snake.length ; ++i ) {
		var cp = snake[i]
		context.fillRect ( grid[cp.x][cp.y].pos.x, grid[cp.x][cp.y].pos.y,
			cell_size.x, cell_size.y )
	}
}

function draw_food () {
	context.fillStyle = "Red"
	context.fillRect ( grid[food.x][food.y].pos.x, grid[food.x][food.y].pos.y,
		cell_size.x, cell_size.y )
}

function draw_score () {
	context.fillStyle = "Green"
	context.font = "30px Arial";
	context.fillText( parseInt(score).toString(), 10, 30);
}

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

function populate_snake () {
	snake = []
	for ( let i = 0 ; i < 5 ; ++i )
		snake.push ( new vec2 ( parseInt(grid_size.x/2), parseInt(grid_size.y/2 + i) ) )
}

function populate_food () {
	food = new vec2 (
		Math.floor ( Math.random() * grid_size.x ),
		Math.floor ( Math.random() * grid_size.y )
	)
}

function resize_function ( event ) {
	canvas.width = parseInt ( window.innerWidth * (95.0 / 100.0) )
	canvas.height = parseInt ( window.innerHeight * (95.0 / 100.0) )
}

function key_pressed ( event ) {
	switch ( event.keyCode ) {
		case 37:
			if ( parseInt(snake_dir.y) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(0), parseInt(-1) )
			}
			break;
		case 38:
			if ( parseInt(snake_dir.x) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(-1), parseInt(0) )
			}
			break;
		case 39:
			if ( parseInt(snake_dir.y) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(0), parseInt(1) )
			}
			break;
		case 40:
			if ( parseInt(snake_dir.x) == parseInt(0) ) {
				snake_dir = new vec2 ( parseInt(1), parseInt(0) )
			}
			break;
		case 82:
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

var frame_skipped = parseInt ( 0 )
function next_frame ( timestamp ) {
	if ( frame_skipped < parseInt ( 6 ) ) {
		frame_skipped += 1
		window.requestAnimationFrame ( next_frame )
		return
	} else {
		frame_skipped = parseInt ( 0 )
	}
	var sh = snake[snake.length - 1]
	if ( sh.x == food.x && sh.y == food.y ) {
		snake = [snake[0]].concat ( snake )
		populate_food ()
		score = parseInt ( score + 1 )
	}
	var found = move_snake ()
	draw_snake ()
	draw_food ()
	draw_score ()
	if ( found != Boolean ( true ) ) {
		window.requestAnimationFrame ( next_frame )
	} else {
		can_reset = new Boolean ( true )
	}
}

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
	window.requestAnimationFrame ( next_frame )
}

window.onload = loaded_function
window.addEventListener ( 'resize', resize_function )
document.onkeydown = key_pressed
