import React from 'react';

interface TimelineScrubberProps {
  currentFrame: number;
  maxFrame: number;
  onChange: (frame: number) => void;
}

const TimelineScrubber: React.FC<TimelineScrubberProps> = ({ currentFrame, maxFrame, onChange }) => {
  return (
    <div style={{ padding: '1rem', background: '#2a2a2a', borderTop: '1px solid #333' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ minWidth: '80px' }}>Frame: {currentFrame}</span>
        <input
          type="range"
          min={0}
          max={maxFrame}
          value={currentFrame}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ minWidth: '80px' }}>Max: {maxFrame}</span>
      </div>
    </div>
  );
};

export default TimelineScrubber;
