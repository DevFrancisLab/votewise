from typing import Dict, List, Any

from langgraph_engine.state import LangGraphState
from langgraph_engine.agents import candidate_agent, pulse_agent, civic_agent, reasoning_agent


class END:
    """Terminal node marker for graph workflow."""


class MemorySaver:
    """Simple in-memory graph saver for state/history persistence."""

    def __init__(self):
        self.storage: Dict[str, Any] = {}

    def save(self, key: str, value: Any):
        self.storage[key] = value

    def load(self, key: str):
        return self.storage.get(key)


class StateGraph:
    """Lightweight state graph implementation."""

    def __init__(self, state_schema=LangGraphState):
        self.nodes: Dict[str, Any] = {}
        self.edges: List[Dict[str, str]] = []
        self.entry_point: str = None
        self.state_schema = state_schema

    def add_node(self, node_id: str, handler=None):
        """Add a node to the graph with optional handler."""
        if handler is None:
            self.nodes[node_id] = None
        else:
            self.nodes[node_id] = handler

    def add_edge(self, source_id: str, target_id: str):
        """Add an edge from source to target node."""
        self.edges.append({"source": source_id, "target": target_id})

    def set_entry_point(self, node_id: str):
        """Set the entry point for graph execution."""
        self.entry_point = node_id

    def compile(self):
        """Compile and return the graph as an executable app."""
        return CompiledGraph(self)

    def run(self, state: LangGraphState, saver: MemorySaver = None):
        current = self.entry_point or "candidate_agent"
        while current != "end":
            handler = self.nodes.get(current)
            if handler is None:
                break
            result = handler(state)
            if saver is not None:
                saver.save(current, result)
            next_node = result.get("next_agent")

            if next_node is None or next_node == "end":
                current = "end"
            else:
                current = next_node
        return state

    def invoke(self, state: LangGraphState, saver: MemorySaver = None):
        """Invoke the graph workflow."""
        return self.run(state, saver)


class CompiledGraph:
    """Represents a compiled and executable state graph."""

    def __init__(self, graph: StateGraph):
        self.graph = graph

    def invoke(self, state: LangGraphState):
        """Invoke the compiled graph with a given state."""
        return self.graph.invoke(state)


def compile_graph(graph: StateGraph, saver: MemorySaver) -> StateGraph:
    """Compile the graph structure and return executable app."""
    # Placeholder compile step; in a real LangGraph system this could validate transitions.
    graph.saver = saver
    return graph


class GraphEngine:
    def __init__(self):
        self.nodes: Dict[str, Any] = {}
        self.edges: List[Dict[str, str]] = []

    def add_node(self, node_id: str, data: Any = None):
        self.nodes[node_id] = data

    def add_edge(self, source_id: str, target_id: str):
        self.edges.append({"source": source_id, "target": target_id})

    def get_neighbors(self, node_id: str) -> List[str]:
        return [e["target"] for e in self.edges if e["source"] == node_id]

    def reset(self):
        self.nodes.clear()
        self.edges.clear()


# Build LangGraph workflow
graph = StateGraph()

# Add nodes
graph.add_node("candidate_agent", candidate_agent)
graph.add_node("pulse_agent", pulse_agent)
graph.add_node("civic_agent", civic_agent)
graph.add_node("reasoning_agent", reasoning_agent)

# Set entry point
graph.set_entry_point("candidate_agent")

# Add edges
graph.add_edge("candidate_agent", "pulse_agent")
graph.add_edge("pulse_agent", "civic_agent")
graph.add_edge("civic_agent", "reasoning_agent")
graph.add_edge("reasoning_agent", "end")

# Compile the graph
app = graph.compile()
