import React, { useState, useEffect } from 'react';
import Challenge from './components/Challenge';
import challenges from './data/challenges.json';
import './style.css';

function App() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex];
  const isLastChallenge = currentChallengeIndex === challenges.length - 1;
  const progress = ((currentChallengeIndex + 1) / challenges.length) * 100;

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption(null); // Reseta a seleção a cada novo desafio
  }, [currentChallengeIndex]);

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const isCorrect = currentChallenge.options[selectedOption]?.isCorrect;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTimeSpent([...timeSpent, timeTaken]);

    if (isCorrect) {
      const timeBonus = Math.max(0, 10 - Math.floor(timeTaken));
      setScore(score + currentChallenge.points + timeBonus);
    }

    if (!isLastChallenge) {
      setTimeout(() => {
        setCurrentChallengeIndex(currentChallengeIndex + 1);
        setFeedback(null);
      }, 1000);
    }
  };

  const generateRanking = () => {
    const totalTime = timeSpent.reduce((acc, curr) => acc + curr, 0);
    return [
      { name: userName || 'Você', score, time: totalTime },
      { name: 'Ana', score: Math.floor(Math.random() * 50) + 20, time: Math.random() * 30 + 10 },
      { name: 'João', score: Math.floor(Math.random() * 50) + 20, time: Math.random() * 30 + 10 },
    ].sort((a, b) => b.score - a.score || a.time - b.time);
  };

  if (!isGameStarted) {
    return (
      <div className="app-container">
        <div className="main-content">
          <h1>JSGame - Desafio Diário</h1>
          <p>Insira seu nome para começar:</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Seu nome"
            className="name-input"
          />
          <button
            onClick={() => {
              if (userName.trim()) {
                setIsGameStarted(true);
              } else {
                alert('Por favor, insira seu nome.');
              }
            }}
            className="start-button"
          >
            Iniciar Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Botão de ranking */}
      <button className="ranking-toggle" onClick={() => setIsRankingOpen(!isRankingOpen)}>
        {isRankingOpen ? 'Fechar Ranking' : 'Ver Ranking'}
      </button>

      {/* Ranking expansível */}
      <div className={`ranking ${isRankingOpen ? 'open' : ''}`}>
        <h2>Ranking do Dia</h2>
        <ol>
          {generateRanking().map((player, index) => (
            <li key={index}>
              {player.name} - {player.score} pts ({player.time.toFixed(1)}s)
            </li>
          ))}
        </ol>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content">
        <h1>JSGame - Desafio Diário</h1>
        <p>Responda rápido e suba no ranking!</p>
        <p className="score">Pontuação: {score}</p>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        {feedback && (
          <div className={`feedback ${feedback}`}>
            {feedback === 'correct'
              ? `Correto! +${currentChallenge.points + Math.max(0, 10 - Math.floor(timeSpent[timeSpent.length - 1]))} pontos`
              : `Errado! O bug era: "${currentChallenge.bug}"`}
          </div>
        )}

        {currentChallenge && (
          <>
            <Challenge
              challenge={currentChallenge}
              onSelectOption={handleSelectOption}
              selectedOption={selectedOption}
            />
            <button onClick={handleSubmit} disabled={selectedOption === null}>
              {isLastChallenge ? 'Finalizar' : 'Enviar e Próximo'}
            </button>
          </>
        )}

        {isLastChallenge && feedback && (
          <div className="end-message">
            <h2>Fim do Desafio!</h2>
            <p>Veja sua posição no ranking.</p>
            <p>Volte amanhã para mais!</p>
            <button
              onClick={() => {
                setCurrentChallengeIndex(0);
                setSelectedOption(null);
                setFeedback(null);
                setScore(0);
                setTimeSpent([]);
                setIsGameStarted(false);
              }}
              className="restart-button"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;