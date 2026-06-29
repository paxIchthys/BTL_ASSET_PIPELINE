import React from 'react';
import { Kit } from '../../types';

interface KitSelectorProps {
  kits: Kit[];
  selectedKit: Kit;
  onSelect: (kit: Kit) => void;
}

const KitSelector: React.FC<KitSelectorProps> = ({ kits, selectedKit, onSelect }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label style={{ fontSize: '0.75rem', color: '#888' }}>Kit:</label>
      <select
        value={selectedKit.id}
        onChange={(e) => {
          const kit = kits.find(k => k.id === e.target.value);
          if (kit) onSelect(kit);
        }}
        style={{ padding: '0.5rem', background: '#3a3a3a', border: '1px solid #4a4a4a', color: '#fff', minWidth: '200px' }}
      >
        {kits.map((kit) => (
          <option key={kit.id} value={kit.id}>
            {kit.id}
          </option>
        ))}
      </select>
    </div>
  );
};

export default KitSelector;
