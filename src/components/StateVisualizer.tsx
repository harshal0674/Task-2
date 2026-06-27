"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Database, FileText, Cpu, CheckCircle } from "lucide-react";

interface StateVisualizerProps {
  state: any;
}

export default function StateVisualizer({ state }: StateVisualizerProps) {
  const [expandedChunk, setExpandedChunk] = useState<number | null>(null);

  if (!state || Object.keys(state).length === 0) return null;

  const steps = ["ingestion", "retrieval", "generation"];
  const currentStepIndex = steps.indexOf(state.currentStep || "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel"
      style={{ marginTop: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Cpu className="text-purple-400" size={24} color="#c084fc" />
        <h2 style={{ color: '#c084fc' }}>Pipeline State</h2>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className={`step ${currentStepIndex >= idx ? 'active' : ''}`}>
              {currentStepIndex >= idx ? <CheckCircle size={16} /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor' }} />}
              <span style={{ textTransform: 'capitalize' }}>{step}</span>
            </div>
            {idx < steps.length - 1 && <div className="step-line" />}
          </React.Fragment>
        ))}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Document Chunks */}
        {state.chunks && state.chunks.length > 0 && (
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={18} color="#94a3b8" />
              <h3 style={{ fontSize: '1rem', color: '#94a3b8' }}>Document Chunks (Count: {state.chunks.length})</h3>
            </div>
            
            {state.chunks.slice(0, 3).map((chunk: string, i: number) => (
              <div key={i} style={{ marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
                <button 
                  onClick={() => setExpandedChunk(expandedChunk === i ? null : i)}
                  style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Chunk {i + 1}</span>
                  {expandedChunk === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {expandedChunk === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="code-block" style={{ border: 'none', borderRadius: '0 0 8px 8px', margin: 0 }}>
                        {chunk}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {state.chunks.length > 3 && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                + {state.chunks.length - 3} more chunks embedded in Pinecone
              </p>
            )}
          </div>
        )}

        {/* Retrieved Context */}
        {state.retrievedContext && state.retrievedContext.length > 0 && (
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Database size={18} color="#94a3b8" />
              <h3 style={{ fontSize: '1rem', color: '#94a3b8' }}>Retrieved Context from Pinecone</h3>
            </div>
            {state.retrievedContext.map((ctx: string, i: number) => (
              <div key={i} className="code-block" style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Top Match {i + 1}</div>
                {ctx}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
