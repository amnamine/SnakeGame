import React, { useState, useEffect } from "react";
import "./App.css";

const initialSnake = [[0, 0]];
const initialFood = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];

function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = () => {
    const head = snake[0];
    const newHead = [head[0] + direction.y, head[1] + direction.x];
    const newSnake = [newHead, ...snake];

    // Check for collision with food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
    } else {
      newSnake.pop(); // Remove the last part of the snake
    }

    // Check for collisions with walls or itself
    if (
      newHead[0] < 0 ||
      newHead[0] >= 20 ||
      newHead[1] < 0 ||
      newHead[1] >= 20 ||
      newSnake.slice(1).some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1])
    ) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const intervalId = setInterval(() => {
      moveSnake();
    }, speed);

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [snake, direction, gameOver]);

  const restartGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      <div className="game-area">
        {gameOver && <div className="game-over">Game Over! <button onClick={restartGame}>Restart</button></div>}
        <div className="snake" style={{ gridTemplateColumns: `repeat(20, 20px)` }}>
          {Array.from({ length: 20 }, (_, row) =>
            Array.from({ length: 20 }, (_, col) => {
              const isSnake = snake.some(segment => segment[0] === row && segment[1] === col);
              const isFood = food[0] === row && food[1] === col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isSnake ? "snake-cell" : ""} ${isFood ? "food-cell" : ""}`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
