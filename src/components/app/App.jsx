import { useState } from 'react';
import { Square } from '../Square/Square';
import { checkWinnerFrom, checkEndGame } from '../../logic/board';
import { saveGameToStorage, resetGameStorage } from '../../logic/storage';
import { TURNS } from '../../constants';
import { WinnerModal } from '../WinnerModal/WinnerModal';
import confetti from 'canvas-confetti';
import './App.css';

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');

    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnsFromStorage = window.localStorage.getItem('turn');
    return turnsFromStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    // Save game
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // Check winner
    const newWinner = checkWinnerFrom(newBoard);

    if (newWinner) {
      confetti();
      setWinner(newWinner)

    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  };

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset game</button>

      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>

        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App;
