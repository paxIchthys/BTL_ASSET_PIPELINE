import React from 'react';
import { Animation } from '../../types';

interface SkeletonSelectorProps {
  animations: Animation[];
  selectedAnimation: Animation;
  onSelect: (animation: Animation) => void;
}

const SkeletonSelector: React.FC<SkeletonSelectorProps> = ({ animations, selectedAnimation, onSelect }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label style={{ fontSize: '0.75rem', color: '#888' }}>Animation:</label>
      <select
        value={selectedAnimation.id}
        onChange={(e) => {
          const anim = animations.find(a => a.id === e.target.value);
          if (anim) onSelect(anim);
        }}
        style={{ padding: '0.5rem', background: '#3a3a3a', border: '1px solid #4a4a4a', color: '#fff', minWidth: '200px' }}
      >
        {animations.map((anim) => (
          <option key={anim.id} value={anim.id}>
            {anim.id} ({anim.skeleton})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SkeletonSelector;
