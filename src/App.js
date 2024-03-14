import './App.css';
import { useEffect, useState } from 'react';
import {Chessboard} from 'react-chessboard'
import {Chess} from 'chess.js'
              

function App() {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);
  const [username , setUsername] = useState('');
  const [showChessboard, setShowChessboard] = useState(false);

 
function safeGameMutate(modify){
  setGame((g)=>{
    const update = {...g}
    modify(update)
    return update;
  })
}

function makeRandomMove(){
  const possibleMove = game.moves ();

  if(game.game_over() || game.in_draw() || possibleMove.length === 0) return;

  const randomIndex = Math.floor(Math.random() * possibleMove.length);

 safeGameMutate((game)=>{
  game.move(possibleMove[randomIndex]);
 })
}


function onDrop(source,target){
  let move = null;
  safeGameMutate((game)=>{
    move = game.move({
      from:source,
      to: target,
      promotion:'q'
    })
})
 
 if(move== null) return false
 
 setTimeout(makeRandomMove, 200);
 return true;
}

useEffect (()=>{
  if(game.game_over()){
    if(game.in_checkmate()){
      setWinner(game.turn()=== 'w'?'Black' : 'White');
    }
    else if(game.in_draw()){
      setWinner('Draw');
    }
  }
},[game]);

const handleStartGame = async (e) => {
  e.preventDefault();
  let result = await fetch(
    'http://localhost:5000/register',{
      method:"post",
      body:JSON.stringify({username}),
      headers:{
        'Content-Type':'application/json'
      }
    }
  )
  result = await result.json();
  console.warn(result);
  if(result){
    alert("Data saved Successfully");
    setGame(new Chess());
    setShowChessboard(true);
    
  }

};


  return (
    <>
     <center><h1 className='heading'>Welcome to the chess game</h1></center>
    <div className="app">
        {!showChessboard && (
          
          <div>
           
            <input className='text-field' type="text"  value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required/>
            <button onClick={handleStartGame} disabled={!username} className='startbutton' >
              Start Game
            </button>
          </div>
        )}
        
        {showChessboard && (
          <>
            <p className="user">Welcome: {username}</p>
            <div className="board-container">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                className="chessboard"
              />
              {winner && (
                <div className="winner">
                  {winner === 'Draw' ? (
                    <p>It's a draw!</p>
                  ) : (
                    <p>{winner === 'White' ? `${username}` : 'Black'} Wins!</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
  </>
  );
}



export default App;