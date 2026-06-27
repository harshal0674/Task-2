import { NextResponse } from "next/server";
import { buildRAGGraph } from "../../../lib/langgraph/graph";
import { GraphStateType } from "../../../lib/langgraph/state";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentState: GraphStateType = body.state || {};
    
    const workflow = buildRAGGraph();
    
    // Run the graph with the current state.
    // In LangGraph JS, invoke takes the input state and returns the final state of that execution.
    const finalState = await workflow.invoke(currentState);
    
    return NextResponse.json({ state: finalState });
  } catch (error: any) {
    console.error("RAG Pipeline Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
