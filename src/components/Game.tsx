"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Game = () => {
    const [size, setSize] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [box, setBox] = useState<string[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("O");
    const [winner, setWinner] = useState<"X" | "O" | "Tie" | null>(null);
    const [winPatterns, setWinPatterns] = useState<number[][][]>([]);
    const [history, setHistory] = useState<string[][][]>([])
    const [stepNumber, setStepNumber] = useState(0)

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
        setWinner(null)
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

        console.log("win patterns: ", patterns)

        return patterns;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(input == ""){
            alert("Please enter the size")
        }
        const num = parseInt(input);
        setSize(num);
        const newBox = createBox(num)
        setBox(newBox);
        setWinPatterns(generateWinPatterns(num));
        setWinner(null);
        setCurrentPlayer("O");
        setHistory([newBox])
        setStepNumber(0)
    };

    const goToStep = (move: number) => {
        setStepNumber(move);
        setBox(history[move]);
        setWinner(null);
         setCurrentPlayer(move % 2 === 0 ? "O" : "X");
    }

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
        const newH = [...history.slice(0, stepNumber + 1), newBox]
        setBox(newBox);
        setHistory(newH);
        setStepNumber(newH.length - 1)

        if (checkGameWinner(currentPlayer, newBox)) {
            setWinner(currentPlayer);
        } else if (newBox.every((row) => row.every((ele) => ele !== ""))) {
            setWinner("Tie");
        } else {
            setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
        }
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
        setHistory([]);
        setStepNumber(0);
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

export default Game;
