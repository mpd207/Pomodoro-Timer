import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css'; // Import CSS file for styling

function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 0) {
            if (isLongBreak) {
              setIsLongBreak(false);
              setTimeRemaining(workDuration * 60);
            } else {
              setIsLongBreak(true);
              setTimeRemaining(breakDuration * 60);
            }
            showNotification();
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isPaused, isLongBreak, breakDuration, workDuration]);

  useEffect(() => {
    if (!isLongBreak && timeRemaining <= 0) {
      setSessionCount(prevCount => prevCount + 1);
    }
  }, [isLongBreak, timeRemaining]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(workDuration * 60);
    setSessionCount(0);
    setIsLongBreak(false);
  };

  const updateTimer = () => {
    setTimeRemaining(workDuration * 60);
  };

  const showNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: 'Time is up!'
          });
        }
      });
    }
  };

  return (
    <div className="pomodoro-timer">
      <h1>Pomodoro Timer</h1>
      <div className="session-type">
        {isLongBreak ? "Long Break" : "Work Session"}
      </div>
      <div className="timer">
        {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
      </div>
      <div className="controls">
        {!isRunning && (
          <button onClick={startTimer}>Start</button>
        )}
        {isRunning && !isPaused && (
          <button onClick={pauseTimer}>Pause</button>
        )}
        {isPaused && (
          <>
            <button onClick={resumeTimer}>Resume</button>
            <button onClick={resetTimer}>Reset</button>
          </>
        )}
      </div>
      <div className="settings-toggle">
        <button onClick={() => setShowSettings(!showSettings)}>Settings</button>
      </div>
      {showSettings && (
        <div className="settings-menu">
          <div>
            <label htmlFor="work-duration">Work Duration (minutes): </label>
            <input
              type="number"
              id="work-duration"
              value={workDuration}
              onChange={(e) => setWorkDuration(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="break-duration">Break Duration (minutes): </label>
            <input
              type="number"
              id="break-duration"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
            />
          </div>
          <button onClick={updateTimer}>Update</button>
        </div>
      )}
      <div className="session-count">
        Sessions Completed: {sessionCount}
      </div>
    </div>
  );
}

export default PomodoroTimer;
