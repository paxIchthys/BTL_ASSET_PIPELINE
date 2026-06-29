import React, { useState, useEffect } from 'react';
import CanvasRenderer from './components/CanvasRenderer';
import TimelineScrubber from './components/TimelineScrubber';
import SkeletonSelector from './components/SkeletonSelector';
import KitSelector from './components/KitSelector';
import DebugOverlay from './components/DebugOverlay';
import { Animation, Kit } from '../types';
import animationsData from '../../data/animations.json';
import kitsData from '../../data/kits.json';

const animations = (animationsData as { animations: Animation[] }).animations;
const kits = (kitsData as { kits: Kit[] }).kits;

function App() {
  const [selectedAnimation, setSelectedAnimation] = useState<Animation>(animations[0]);
  const [selectedKit, setSelectedKit] = useState<Kit>(kits[0]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showDebug, setShowDebug] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const maxFrame = selectedAnimation.frames.length > 0 
    ? selectedAnimation.frames[selectedAnimation.frames.length - 1].frame 
    : 0;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= maxFrame) return 0;
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, maxFrame]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '1rem', background: '#2a2a2a', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <SkeletonSelector
          animations={animations}
          selectedAnimation={selectedAnimation}
          onSelect={setSelectedAnimation}
        />
        <KitSelector
          kits={kits}
          selectedKit={selectedKit}
          onSelect={setSelectedKit}
        />
        <button
          onClick={() => setShowDebug(!showDebug)}
          style={{ padding: '0.5rem 1rem', background: '#3a3a3a', border: '1px solid #4a4a4a', color: '#fff', cursor: 'pointer' }}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ padding: '0.5rem 1rem', background: isPlaying ? '#4a4a4a' : '#3a3a3a', border: '1px solid #4a4a4a', color: '#fff', cursor: 'pointer' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}>
        <CanvasRenderer
          animation={selectedAnimation}
          kit={selectedKit}
          frame={currentFrame}
        />
        {showDebug && (
          <DebugOverlay
            animation={selectedAnimation}
            kit={selectedKit}
            frame={currentFrame}
          />
        )}
      </div>

      <TimelineScrubber
        currentFrame={currentFrame}
        maxFrame={maxFrame}
        onChange={setCurrentFrame}
      />
    </div>
  );
}

export default App;
