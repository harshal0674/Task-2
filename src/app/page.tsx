"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import StateVisualizer from "../components/StateVisualizer";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [docText, setDocText] = useState("");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleRunPipeline = async () => {
    setLoading(true);
    try {
      // Construct payload state
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

  return (
    <main className="container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>RAG Learn Studio</h1>
        
        <div className="grid-2">
          {/* Left Column: Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel">
              <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "#60a5fa" }}>1. Document Ingestion</h2>
              <p style={{ marginBottom: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Paste the text of the document you want to index.
              </p>
              <textarea 
                className="input textarea" 
                placeholder="Paste document text here..."
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                disabled={state.currentStep === 'ingestion' || state.currentStep === 'generation'}
              />
              <button 
                className="btn" 
                style={{ width: "100%" }}
                onClick={handleRunPipeline}
                disabled={loading || !docText || state.currentStep === 'ingestion'}
              >
                {loading && !state.currentStep ? <Loader2 className="animate-spin inline mr-2" size={16} /> : null}
                Run Ingestion
              </button>
            </div>

            <div className="glass-panel" style={{ opacity: state.currentStep ? 1 : 0.5 }}>
              <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "#60a5fa" }}>2. Query & Generation</h2>
              <input 
                type="text" 
                className="input" 
                placeholder="Ask a question about the document..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={!state.currentStep || loading}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn" 
                  style={{ flex: 1 }}
                  onClick={handleRunPipeline}
                  disabled={loading || !query || !state.currentStep}
                >
                  {loading && state.currentStep ? <Loader2 className="animate-spin inline mr-2" size={16} /> : null}
                  Resume Pipeline
                </button>
                <button 
                  className="btn" 
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visualizer & Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {state.answer && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ borderColor: '#34d399' }}>
                <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "#34d399" }}>Final AI Answer</h2>
                <div className="answer-content">
                  {state.answer}
                </div>
              </motion.div>
            )}

            <StateVisualizer state={state} />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
