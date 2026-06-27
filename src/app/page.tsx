"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import StateVisualizer from "../components/StateVisualizer";
import { Loader2, Play, RefreshCw, UploadCloud, Search, Sparkles, BrainCircuit } from "lucide-react";

export default function Home() {
  const [docText, setDocText] = useState("");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleRunPipeline = async () => {
    setLoading(true);
    try {
      const payloadState = {
        ...state,
        documentText: docText || state.documentText,
        query: query || state.query,
      };

      const res = await fetch("/api/rag-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: payloadState }),
      });
      
      const data = await res.json();
      if (data.state) {
        setState(data.state);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setState({});
    setDocText("");
    setQuery("");
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto', width: '100%', maxWidth: '1300px' }}>
          <BrainCircuit size={28} color="#60a5fa" />
          <h1 style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '-0.03em' }} className="gradient-text">RAG Learn Studio</h1>
        </div>
      </header>

      <main className="container" style={{ flex: 1 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          
          <div className="grid-2">
            {/* Left Column: Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Step 1: Ingestion */}
              <motion.div variants={itemVariants} className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <UploadCloud size={22} color="#60a5fa" />
                  <h2 style={{ fontSize: "1.25rem", color: "#60a5fa" }}>1. Document Ingestion</h2>
                </div>
                
                <p style={{ marginBottom: "1.25rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  Paste the raw text of the document you want to index. The system will chunk and embed it using Gemini 2.5 Flash.
                </p>
                
                <div className="input-wrapper">
                  <textarea 
                    className="input textarea" 
                    placeholder="Enter document content here..."
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    disabled={state.currentStep === 'ingestion' || state.currentStep === 'generation'}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: "100%" }}
                  onClick={handleRunPipeline}
                  disabled={loading || !docText || state.currentStep === 'ingestion'}
                >
                  {loading && !state.currentStep ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                  {state.currentStep === 'ingestion' ? 'Ingestion Complete' : 'Run Ingestion'}
                </button>
              </motion.div>

              {/* Step 2: Query */}
              <motion.div variants={itemVariants} className="glass-panel" style={{ opacity: state.currentStep ? 1 : 0.5, transition: 'opacity 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Search size={22} color="#c084fc" />
                  <h2 style={{ fontSize: "1.25rem", color: "#c084fc" }}>2. Query & Generation</h2>
                </div>
                
                <p style={{ marginBottom: "1.25rem", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  Ask a question about your ingested document.
                </p>

                <div className="input-wrapper">
                  <Search className="input-icon" size={18} />
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. What is the main topic?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={!state.currentStep || loading || state.currentStep === 'generation'}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)' }}
                    onClick={handleRunPipeline}
                    disabled={loading || !query || !state.currentStep || state.currentStep === 'generation'}
                  >
                    {loading && state.currentStep ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    Resume Pipeline
                  </button>
                  <button 
                    className="btn" 
                    style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    onClick={handleReset}
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Visualizer & Output */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AnimatePresence mode="popLayout">
                {state.answer && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    className="glass-panel" 
                    style={{ border: '1px solid rgba(20, 184, 166, 0.3)', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #14b8a6, transparent)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: "1rem" }}>
                      <Sparkles size={22} color="#14b8a6" />
                      <h2 style={{ fontSize: "1.25rem", color: "#14b8a6" }}>AI Response</h2>
                    </div>
                    <div className="answer-content">
                      {state.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <StateVisualizer state={state} />
              
              {!state.currentStep && !loading && (
                <motion.div variants={itemVariants} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--panel-border)', borderRadius: '16px', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <BrainCircuit size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                    <p>Awaiting document ingestion to start the visualization pipeline.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
