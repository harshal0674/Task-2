"use client";

import React from "react";
import { motion } from "framer-motion";

interface StateVisualizerProps {
  state: any;
}

export default function StateVisualizer({ state }: StateVisualizerProps) {
  if (!state || Object.keys(state).length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ marginTop: '2rem' }}
    >
      <h2 style={{ marginBottom: '1rem', color: '#c084fc' }}>Pipeline State (HITL)</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Current Step</h3>
          <p style={{ fontWeight: 600, color: '#34d399' }}>{state.currentStep || "Start"}</p>
        </div>

        {state.chunks && state.chunks.length > 0 && (
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Document Chunks (Count: {state.chunks.length})</h3>
            <div className="code-block">
              {state.chunks[0].substring(0, 100)}...
            </div>
          </div>
        )}

        {state.retrievedContext && state.retrievedContext.length > 0 && (
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Retrieved Context (Top K: {state.retrievedContext.length})</h3>
            {state.retrievedContext.map((ctx: string, i: number) => (
              <div key={i} className="code-block" style={{ marginBottom: '0.5rem' }}>
                [Chunk {i + 1}] {ctx.substring(0, 150)}...
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
