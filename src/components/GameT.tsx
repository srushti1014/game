"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Task = () => {
    // const [isOTurn, setIsOTurn] = useState(true);
    const [size, setSize] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [box, setBox] = useState<string[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("O");
    const [winner, setWinner] = useState<"X" | "O" | "Tie" | null>(null);
    const [winPatterns, setWinPatterns] = useState<number[][][]>([]);
    const [history, setHistory] = useState<{ row: number; col: number; player: "X" | "O" }[]>([]);

    useEffect(() => {
        console.log("current player now:", currentPlayer);
    }, [currentPlayer]);

    const undoGame = () => {
        if (history.length === 0) {
            return;
        }
        const lastTurn = history[history.length - 1];
        // console.log("lastTurn : ", lastTurn);
        //const newBox = [...box] //shallow copy
        // The array newBox is new
        // But arrays -> rows are the same as in box

        const newBox = box.map((row) => [...row]);
        newBox[lastTurn.row][lastTurn.col] = "";
        // setHistory(history.pop())
        // console.log("history before: ", history);
        const updatedH = history.slice(0, history.length - 1);
        // setTimeout(() => {
        //     console.log("history after: ", updatedH);
        // }, 3000);
        setBox(newBox);
        setHistory(updatedH);
        setCurrentPlayer(lastTurn.player);
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

        // console.log("win patterns: ", patterns)

        return patterns;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(input);
        setSize(num);
        setBox(createBox(num));
        setWinPatterns(generateWinPatterns(num));
        setWinner(null);
        setCurrentPlayer("O");
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
        const newBox = [...box];
        newBox[row][col] = currentPlayer;
        setBox(newBox);
        // console.log("this new Box: ", newBox);
        // console.log("current player befor:", currentPlayer);
        setHistory([...history, { row, col, player: currentPlayer }]);

        if (checkGameWinner(currentPlayer, newBox)) {
            setWinner(currentPlayer);
        } else if (newBox.every((row) => row.every((ele) => ele !== ""))) {
            setWinner("Tie");
        } else {
            setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
        }
        // console.log("current player after:", currentPlayer);
    };

    const checkGameWinner = (currentPlayer: string, newBox: string[][]) => {
        for (const pat of winPatterns) {
            // console.log("pat", pat);

            if (pat.every(([i, j]) => newBox[i][j] == currentPlayer)) {
                return true;
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
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <h1 className="text-3xl font-bold text-amber-300 py-3">Tic Tac Toe</h1>

            {size ? (
                <div>
                    {Array.from({ length: size }).map((_, row) => (
                        <div key={row} className="flex">
                            {Array.from({ length: size }).map((_, col) => (
                                <div
                                    key={col}
                                    onClick={() => handleClick(row, col)}
                                    className="w-20 h-20 border border-black flex items-center justify-center text-4xl"
                                >
                                    {box[row][col]}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="number"
                            min={2}
                            max={8}
                            value={input}
                            placeholder="matrix sizw"
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
                <div className="text-xl font-semibold">
                    {winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}
                </div>
            )}

            {!winner && size && (
                <button
                    onClick={undoGame}
                    className="mt-2 text-xl bg-orange-400 text-black px-3 py-1 rounded"
                >
                    undo step
                </button>
            )}

            {size && (
                <button
                    onClick={resetGame}
                    className="mt-2 mb-8 text-xl bg-green-700 text-white px-3.5 py-1.5 rounded"
                >
                    Reset Game
                </button>
            )}
        </div>
    );
};

export default Task;

{
    /* <div
                          className="grid gap-1"
                          style={{
                              gridTemplateColumns: `repeat(${size}, 1fr)`,
                              gridTemplateRows: `repeat(${size}, 1fr)`,
                          }}
                      >
                          {box.map((value, index) => (
                              <button
                                  key={index}
                                  onClick={() => handleClick(index)}
                                  className={`w-16 h-16 text-2xl font-bold border border-black ${value === "X"
                                          ? "text-red-500"
                                          : value === "O"
                                              ? "text-blue-500"
                                              : ""
                                      }`}
                                  disabled={value !== "" || winner !== null}
                              >
                                  {value}
                              </button>
                          ))}
                      </div> */
}

// const drawMatrix = () => {
//     console.log(size)
//     if (size && size > 1) {
//         const totalCells = size * size;
//         setBox(Array(totalCells).fill(""));
//         setWinPatterns(generateWinPatterns(size));
//         setWinner(null);
//         setIsOTurn(true);
//     }
// };

// const handleClick = (index: number) => {
//     const newBox = [...box];
//     newBox[index] = isOTurn ? "O" : "X";
//     setBox(newBox);
//     setIsOTurn(!isOTurn);

//     const gameWinner = checkWinner(newBox);
//     if (gameWinner) {
//         setWinner(gameWinner);
//     } else if (newBox.every(i => i !== "")) {
//         setWinner("Tie")
//     }
// }

// const checkWinner = (box: Player[]): Player | null => {
//     for (const pattern of winPatterns) {
//         const [a, b, c] = pattern;
//         if (
//             box[a] &&
//             box[a] === box[b] &&
//             box[a] === box[c]
//         ) {
//             return box[a];
//         }
//     }
//     return null
// }

// const resetGame = () => {
//     setBox(Array(9).fill(""));
//     setIsOTurn(true);
//     setWinner(null);
// };
