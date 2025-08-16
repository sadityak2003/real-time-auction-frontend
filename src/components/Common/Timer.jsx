import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../../utils/formatter';
import './styles/Timer.css';  

const Timer = ({ endTime, onEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = formatTimeRemaining(endTime);
      setTimeRemaining(remaining);
      
      if (remaining === 'Ended' && onEnd) {
        onEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  const isEnding = timeRemaining.includes('m') && 
                   !timeRemaining.includes('h') && 
                   !timeRemaining.includes('d');

  return (
    <div className={`timer ${isEnding ? 'timer-ending' : ''}`}>
      {timeRemaining === 'Ended' ? (
        <span className="timer-ended">Auction Ended</span>
      ) : (
        <span>Time remaining: {timeRemaining}</span>
      )}
    </div>
  );
};

export default Timer;
