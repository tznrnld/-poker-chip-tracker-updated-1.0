import React, { useState } from 'react';

function App() {
  const [tableCode, setTableCode] = useState("");
  const [host, setHost] = useState(false);
  const [nickname, setNickname] = useState("");
  const [players, setPlayers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [pot, setPot] = useState(0);
  const [betAmount, setBetAmount] = useState(0);

  const createTable = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setTableCode(code);
    setHost(true);
    setPlayers([]);
    setJoined(true);
  };

  const joinTable = () => {
    if (!nickname) return;
    setPlayers(prev => [...prev, { name: nickname, chips: 1000, bet: 0 }]);
    setJoined(true);
  };

  const placeBet = (index) => {
    if (betAmount <= 0 || betAmount > players[index].chips) return;
    const updated = [...players];
    updated[index].chips -= betAmount;
    updated[index].bet += betAmount;
    setPlayers(updated);
    setPot(prev => prev + betAmount);
    setBetAmount(0);
  };

  const updateChips = (index, amount) => {
    const updated = [...players];
    updated[index].chips += amount;
    setPlayers(updated);
  };

  const distributePot = (index) => {
    const updated = [...players];
    updated[index].chips += pot;
    updated.forEach(p => p.bet = 0);
    setPlayers(updated);
    setPot(0);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto', fontFamily: 'sans-serif' }}>
      {!joined && (
        <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 8 }}>
          <input
            placeholder="Your nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <button onClick={createTable} style={{ marginRight: 10 }}>Create Table</button>
          <input
            placeholder="Enter table code"
            value={tableCode}
            onChange={e => setTableCode(e.target.value)}
            style={{ marginRight: 10, padding: 8 }}
          />
          <button onClick={joinTable}>Join</button>
        </div>
      )}

      {joined && (
        <div>
          <h2>Table: {tableCode}</h2>
          <h3>Total Pot: {pot} chips</h3>
          {players.map((player, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              marginTop: 10,
              border: '1px solid #ddd',
              borderRadius: 6
            }}>
              <div>
                <strong>{player.name}</strong><br />
                Stack: {player.chips} chips<br />
                Bet: {player.bet} chips
              </div>
              {host && (
                <div>
                  <button onClick={() => updateChips(index, -100)}>-100</button>
                  <button onClick={() => updateChips(index, 100)} style={{ marginLeft: 5 }}>+100</button>
                  <button onClick={() => distributePot(index)} style={{ marginLeft: 10 }}>🏆 Pot to {player.name}</button>
                </div>
              )}
              {!host && player.name === nickname && (
                <div style={{ marginLeft: 10 }}>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={e => setBetAmount(parseInt(e.target.value) || 0)}
                    style={{ width: 60, marginRight: 5 }}
                  />
                  <button onClick={() => placeBet(index)}>Bet</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
