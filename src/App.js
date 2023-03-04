import React, { useState, useEffect } from "react";
import "./App.css";

const GRID_SIZE = 10;
const blank = (GRID_SIZE*GRID_SIZE)*.4; // max value = 0.999

const HEALTH_MAP = {
  Blank: 0,
  Speeder: -1,
  Lava: -5,
  Mud: -1,
  // scale of this 100 GRID_SIZE
  // Blank: 0,
  // Speeder: -5,
  // Lava: -50,
  // Mud: -10,
};

const MOVES_MAP = {
  Blank: 0,
  Speeder: -1,
  Lava: -10,
  Mud: -5,
  // scale of 100 GRID_SIZE
  // Blank: -1, 
  // Speeder: 0,
  // Lava: -10,
  // Mud: -5,
};

const GameBoard = () => {
  const [grid, setGrid] = useState(generateRandomGrid());
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [health, setHealth] = useState(40); // 200 in 100
  const [moves, setMoves] = useState(90); // 450 in 100
  const [win, setWin] = useState(false);

  // Handle arrow key events to move the player on the grid
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (playerPosition[0] > 0) {
          movePlayer([playerPosition[0] - 1, playerPosition[1]]);
        }
        break;
      case "ArrowDown":
        if (playerPosition[0] < GRID_SIZE - 1) {
          movePlayer([playerPosition[0] + 1, playerPosition[1]]);
        }
        break;
      case "ArrowLeft":
        if (playerPosition[1] > 0) {
          movePlayer([playerPosition[0], playerPosition[1] - 1]);
        }
        break;
      case "ArrowRight":
        if (playerPosition[1] < GRID_SIZE - 1) {
          movePlayer([playerPosition[0], playerPosition[1] + 1]);
        }
        break;
      default:
        break;
    }
  };

  // Move the player to the given position and update health/moves based on the state of the cell they land on
  const movePlayer = (position) => {
    const [x, y] = position;
    const cell = grid[x][y];
    const newHealth = health + HEALTH_MAP[cell];
   
    const newMoves = moves + MOVES_MAP[cell];

    if (newHealth <= 0) {
      alert("Game Over: You ran out of health!");
      resetGame();
    } else if (newMoves <= 0) {
      alert("Game Over: You ran out of moves!");
      resetGame();
    } else {
      setPlayerPosition(position);
      setHealth(newHealth);
      // console.log('newHelth', newHealth)
      setMoves(newMoves);
      if (cell === "WIN") {
        setWin(true);
      }
    }
  };
  // create random grid
  function generateRandomGrid() {
    const cells = ["Blank", "Speeder", "Lava", "Mud"];
    let blankCount = 0;
    const grid = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        console.log(randomCell)
        if (randomCell === "Blank") {
          blankCount++;
        }
        row.push(randomCell);
      }
      grid.push(row);
    }

    while (blankCount < blank) { // less then (GRID_SIZE * GRID_SIZE)
      const randomRow = Math.floor(Math.random() * GRID_SIZE);
      console.log('randomRow',randomRow)
      const randomCol = Math.floor(Math.random() * GRID_SIZE);
      if (grid[randomRow][randomCol] !== "Blank") {
        grid[randomRow][randomCol] = "Blank";
        blankCount++;
      }
    }

    // Add a single "WIN" cell to the grid
    const randomWinRow = Math.floor(Math.random() * GRID_SIZE);
    console.log('rwr', randomWinRow)
    const randomWinCol = Math.floor(Math.random() * GRID_SIZE);
    if(randomWinCol && randomWinRow === 0){
      grid[GRID_SIZE-1][GRID_SIZE-1] = "WIN"
    } else if(randomWinCol === 0 && randomWinRow === 1){
      grid[GRID_SIZE-1][GRID_SIZE-1] = "WIN"
    } else if(randomWinCol === 1 && randomWinRow === 0){
      grid[GRID_SIZE-1][GRID_SIZE-1] = "WIN"
    }else{
      grid[randomWinRow][randomWinCol] = "WIN";
    }
    return grid;
  }

  // Reset the game to its initial state
  const resetGame = () => {
    const randomGrid = generateRandomGrid();
    setGrid(randomGrid);
    setPlayerPosition([0, 0]);
    setHealth(20);  // 200 in 100
    setMoves(45); // 450 in 100
  };

  // Listen for arrow key events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (win) {
      alert("GOALLLLLLLLLLLLLLLLL!");
      setWin(false);
      resetGame();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition, win]);

  // Render the game board
  return (
    <div className="game-board">
      <div className="stats">
        <div>Health: {health}</div>
        <div>Moves: {moves}</div>
      </div>
      <div className="grid-container">
        {console.log("grid", grid)}
        {grid.map((row, rowIndex) => (
          <div className="grid-row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                className={`grid-cell ${
                  playerPosition[0] === rowIndex &&
                  playerPosition[1] === cellIndex
                    ? "player"
                    : ""
                } ${cell.toLowerCase()}`}
                key={`${rowIndex}-${cellIndex}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color player"></div>
          <div className="legend-name">Player</div>
        </div>
        <div className="legend-item">
          <div className="legend-color mud"></div>
          <div className="legend-name">Ronaldo</div>
        </div>
        <div className="legend-item">
          <div className="legend-color lava"></div>
          <div className="legend-name">Messi</div>
        </div>
        <div className="legend-item">
          <div className="legend-color speeder"></div>
          <div className="legend-name">Nymer</div>
        </div>
        <div className="legend-item">
          <div className="legend-color blank"></div>
          <div className="legend-name">Blank</div>
        </div>
        <div className="legend-item">
          <div className="legend-color win"></div>
          <div className="legend-name">Finish Point</div>
        </div>
      </div>

      <button onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default GameBoard;
