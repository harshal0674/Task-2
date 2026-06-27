import { StateGraph, END, START } from "@langchain/langgraph";
import { GraphState, GraphStateType } from "./state";
import { ingestionNode } from "./nodes/ingestion";
import { retrievalNode } from "./nodes/retrieval";
import { generationNode } from "./nodes/generation";

// Supervisor deterministic routing logic
const supervisorRouting = (state: GraphStateType) => {
  if (state.documentText && (!state.chunks || state.chunks.length === 0)) {
    return "ingestion";
  }
  
  if (state.query && (!state.retrievedContext || state.retrievedContext.length === 0)) {
    return "retrieval";
  }
  
  if (state.query && state.retrievedContext && state.retrievedContext.length > 0) {
    return "generation";
  }
  
  return END;
};

// Build the LangGraph workflow
export const buildRAGGraph = () => {
  const workflow = new StateGraph(GraphState)
    // Add nodes
    .addNode("ingestion", ingestionNode)
    .addNode("retrieval", retrievalNode)
    .addNode("generation", generationNode)
    
    // Add edges
    // Start -> Supervisor logic essentially means deciding the first step.
    // However, LangGraph needs static edges or conditional edges.
    .addConditionalEdges(START, supervisorRouting)
    
    // After ingestion, if there's a query we could go to retrieval, but in a step-by-step HITL, we end and let frontend resume
    .addEdge("ingestion", END)
    
    // After retrieval, go to END to allow HITL inspection of vectors/chunks
    .addEdge("retrieval", END)
    
    // After generation, pipeline is done
    .addEdge("generation", END);

  return workflow.compile();
};
