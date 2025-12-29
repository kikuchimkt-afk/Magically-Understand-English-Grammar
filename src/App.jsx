import React, { useState, useEffect } from 'react';
import LearningInterface from './components/LearningInterface';
import CourseMap from './components/CourseMap';
import levels from './data/levels.json';

function App() {
  const [view, setView] = useState('map'); // 'map', 'learning'
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  // Store completed levels in localStorage for persistence
  const [completedLevels, setCompletedLevels] = useState(() => {
    const saved = localStorage.getItem('completedLevels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  const handleSelectLevel = (index) => {
    setCurrentLevelIndex(index);
    setView('learning');
  };

  const handleLevelComplete = () => {
    // Mark current as completed if not already
    if (!completedLevels.includes(currentLevelIndex + 1)) {
      setCompletedLevels(prev => [...prev, currentLevelIndex + 1]);
    }
  };

  const handleNextLevel = () => {
    handleLevelComplete();
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      // Finished all levels
      setView('map');
    }
  };

  const handleBackToMap = () => {
    // Also save progress if they go back after completing? 
    // Usually they click Next, but if they go back, maybe not completed yet.
    // If they finished the puzzle, handleLevelComplete is called inside LearningInterface? 
    // No, LearningInterface calls onNextLevel. 
    // Let's call handleLevelComplete only when they explicitly finish.
    setView('map');
  };

  return (
    <div className="w-full min-h-screen">
      {view === 'map' ? (
        <CourseMap
          onSelectLevel={handleSelectLevel}
          completedLevels={completedLevels}
        />
      ) : (
        <LearningInterface
          levelIndex={currentLevelIndex}
          onBack={handleBackToMap}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
}

export default App;
