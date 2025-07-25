"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const Game = () => {
  const [size, setSize] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [box, setBox] = useState<string[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("O");
  const [winner, setWinner] = useState<"X" | "O" | "Tie" | null>(null);
  const [winPatterns, setWinPatterns] = useState<number[][][]>([]);
  const [history, setHistory] = useState<string[][][]>([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [winningCells, setWinningCells] = useState<number[][]>([]);

  const clickSound =
    typeof window !== "undefined" ? new Audio("/Click.wav") : null;
  const winSound = typeof window !== "undefined" ? new Audio("/win.wav") : null;
  const tieSound = typeof window !== "undefined" ? new Audio("/Tie.wav") : null;

  useEffect(() => {
    console.log("current player now:", currentPlayer);
  }, [currentPlayer]);

  const undoGame = () => {
    if (history.length === 0 || stepNumber === 0) {
      return;
    }
    const prevStep = stepNumber - 1;
    setStepNumber(prevStep);
    setBox(history[prevStep]);

    setCurrentPlayer(prevStep % 2 === 0 ? "O" : "X");
    setWinner(null);
  };

  const generateWinPatterns = (size: number): number[][][] => {
    const patterns: number[][][] = [];
    for (let i = 0; i < size; i++) {
      const pattern: number[][] = [];
      for (let j = 0; j < size; j++) {
        pattern.push([i, j]);
      }
      patterns.push(pattern);
    }

    for (let i = 0; i < size; i++) {
      const pattern: number[][] = [];
      for (let j = 0; j < size; j++) {
        pattern.push([j, i]);
      }
      patterns.push(pattern);
    }

    const diag1: number[][] = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i == j) {
          diag1.push([i, j]);
        }
      }
      patterns.push(diag1);
    }

    const diag2: number[][] = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i + j == size - 1) {
          diag2.push([i, j]);
        }
      }
      patterns.push(diag2);
    }

    console.log("win patterns: ", patterns);

    return patterns;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input == "") {
      alert("Please enter the size");
    }
    const num = parseInt(input);
    setSize(num);
    const newBox = createBox(num);
    setBox(newBox);
    setWinPatterns(generateWinPatterns(num));
    setWinner(null);
    setCurrentPlayer("O");
    setHistory([newBox]);
    setStepNumber(0);
  };

  const goToStep = (move: number) => {
    setStepNumber(move);
    setBox(history[move]);
    setWinner(null);
    setCurrentPlayer(move % 2 === 0 ? "O" : "X");
    // setWinningCells([]);
  };

  const createBox = (size: number) => {
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push("");
      }
      board.push(row);
    }
    return board;
  };

  const handleClick = (row: number, col: number) => {


    if (box[row][col] !== "" || winner) return;
    const newBox = box.map((row) => [...row]);
    newBox[row][col] = currentPlayer;

    const newH = [...history.slice(0, stepNumber + 1), newBox];
    setBox(newBox);
    setHistory(newH);
    setStepNumber(newH.length - 1);
    setLastMove([row, col]);

    const winnigCom = checkGameWinner(currentPlayer, newBox);

    if (winnigCom) {
      setWinner(currentPlayer);
      setWinningCells(winnigCom);
      if (winSound) winSound.play();
    } else if (newBox.every((row) => row.every((ele) => ele !== ""))) {
      setWinner("Tie");
      if (tieSound) tieSound.play();
    } else {
      setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
    }
    if (clickSound) clickSound.play();
  };

  const checkGameWinner = (currentPlayer: string, newBox: string[][]) => {
    for (const pat of winPatterns) {
      // console.log("pat", pat);
      if (pat.every(([i, j]) => newBox[i][j] == currentPlayer)) {
        return pat;
      }
    }
    return false;
  };

  const resetGame = () => {
    setSize(null);
    setInput("");
    setBox([]);
    setWinner(null);
    setCurrentPlayer("O");
    setHistory([]);
    setStepNumber(0);
    setLastMove(null);
    setWinningCells([]);
  };
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-500 py-3">
        Tic Tac Toe
      </h1>

      {size ? (
        <>
          <div>
            {Array.from({ length: size }).map((_, row) => (
              <div key={row} className="flex">
                {Array.from({ length: size }).map((_, col) => {
                  const isLastMove =
                    lastMove && lastMove[0] === row && lastMove[1] === col;
                  const isWinningCell = winningCells.some(
                    ([r, c]) => r === row && c === col
                  );

                  return (
                    <div
                      key={col}
                      onClick={() => handleClick(row, col)}
                      className={`w-20 h-20 border dark:border-[#c5b8b8] border-black flex items-center justify-center text-4xl transition
                     ${isLastMove && !isWinningCell
                          ? "bg-[#dedfe0] dark:bg-[#363636]"
                          : ""
                        }
                       ${isWinningCell ? "bg-[#fddbdb] dark:bg-[#3b565f]" : ""
                        }`}
                    >
                      {box[row][col] === "X" && (
                        <svg
                          className="text-[#A4C454]"
                          width="50"
                          height="50"
                          viewBox="0 0 50 50"
                        >
                          <motion.path
                            d="M10 10 L40 40 M40 10 L10 40"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray="84"
                            strokeDashoffset="84"
                            initial={{ strokeDashoffset: 84 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        </svg>
                      )}

                      {box[row][col] === "O" && (
                        <svg
                          className="text-[#F28F32]"
                          width="50"
                          height="50"
                          viewBox="0 0 50 50"
                        >
                          <motion.circle
                            cx="25"
                            cy="25"
                            r="15"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray="94"
                            strokeDashoffset="94"
                            initial={{ strokeDashoffset: 94 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              min={2}
              max={10}
              value={input}
              placeholder="matrix size"
              onChange={(e) => setInput(e.target.value)}
              className="px-2 w-xs"
            />
            <Button type="submit" className="py-2 mt-4">
              Go
            </Button>
          </form>
        </>
      )}

      {winner && (
        <div className="text-4xl font-semibold dark:text-[#a07affd8] text-[#60499b]">
          {winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}
        </div>
      )}

      {history.length > 1 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Move History</h3>
          <ul>
            {history.map((_, move) => (
              <li key={move}>
                <button onClick={() => goToStep(move)}>
                  {`Go to Move ${move}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        {!winner && size && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undoGame}
            className="
        px-5 py-2 rounded-xl font-semibold text-lg shadow-md
        bg-[#55b3a8] text-black hover:bg-[#4B9B92]
        dark:bg-[#480872] dark:text-white dark:hover:bg-[#480872cb]
        transition-all duration-300"
          >
            Undo
          </motion.button>
        )}

        {size && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="
        px-5 py-2 rounded-xl font-semibold text-lg shadow-md
        bg-[#3b6b7a] text-white hover:bg-[#2E535F]
        dark:bg-[#0B48A1] dark:hover:bg-[#0b47a1ce]
        transition-all duration-300"
          >
            Reset
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Game;
