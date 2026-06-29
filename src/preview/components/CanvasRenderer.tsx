import React, { useRef, useEffect } from 'react';
import { Animation, Kit } from '../../types';
import { resolveFrame } from '../../core/resolver';

interface CanvasRendererProps {
  animation: Animation;
  kit: Kit;
  frame: number;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ animation, kit, frame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const rendered = resolveFrame({ animation, kit, frame });

    for (const [slotId, slot] of Object.entries(rendered.slots)) {
      ctx.save();

      const centerX = width / 2;
      const centerY = height / 2;

      ctx.translate(centerX, centerY);

      if (slot.transform.rotation) {
        ctx.rotate((slot.transform.rotation * Math.PI) / 180);
      }

      if (slot.transform.scale) {
        ctx.scale(slot.transform.scale, slot.transform.scale);
      }

      const offsetX = slot.transform.offsetX ?? 0;
      const offsetY = slot.transform.offsetY ?? 0;
      ctx.translate(offsetX, offsetY);

      ctx.fillStyle = getSlotColor(slotId);
      ctx.fillRect(-20, -20, 40, 40);

      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(slotId, 0, -25);

      ctx.restore();
    }
  }, [animation, kit, frame]);

  const getSlotColor = (slotId: string): string => {
    const colors: Record<string, string> = {
      HEAD: '#ff6b6b',
      BODY: '#4ecdc4',
      WINGS: '#45b7d1',
      LEGS: '#96ceb4',
      ARMS: '#ffeaa7',
      TAIL: '#dfe6e9'
    };
    return colors[slotId] || '#ffffff';
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid #333', background: '#111' }}
    />
  );
};

export default CanvasRenderer;
