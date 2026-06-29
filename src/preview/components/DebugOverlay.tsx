import React from 'react';
import { Animation, Kit } from '../../types';
import { resolveFrame } from '../../core/resolver';

interface DebugOverlayProps {
  animation: Animation;
  kit: Kit;
  frame: number;
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({ animation, kit, frame }) => {
  const rendered = resolveFrame({ animation, kit, frame });

  return (
    <div style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      border: '1px solid #333'
    }}>
      <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#4ecdc4' }}>
        Frame {frame}
      </div>
      <div style={{ marginBottom: '0.5rem', color: '#888' }}>
        Animation: {animation.id}
      </div>
      <div style={{ marginBottom: '0.5rem', color: '#888' }}>
        Kit: {kit.id}
      </div>
      <div style={{ marginTop: '1rem', fontWeight: 'bold', color: '#ffeaa7' }}>
        Slots:
      </div>
      {Object.entries(rendered.slots).map(([slotId, slot]) => (
        <div key={slotId} style={{ marginTop: '0.25rem', paddingLeft: '0.5rem' }}>
          <div style={{ color: '#ff6b6b' }}>{slotId}:</div>
          <div style={{ paddingLeft: '0.5rem', fontSize: '0.75rem' }}>
            Asset: {slot.assetId}
          </div>
          <div style={{ paddingLeft: '0.5rem', fontSize: '0.75rem' }}>
            Transform: {JSON.stringify(slot.transform)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DebugOverlay;
