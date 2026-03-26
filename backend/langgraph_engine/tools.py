from typing import Callable, Dict, Any
import os

from dotenv import load_dotenv

# Ensure environment variables are loaded, including TAVILY_API_KEY
load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

try:
    from tavily import TavilySearchResults
except ImportError:
    TavilySearchResults = None


def tool(func: Callable[..., Any]) -> Callable[..., Any]:
    """Decorator to mark a function as a LangGraph tool."""
    func.is_tool = True
    return func


class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Callable[..., Any]] = {}

    def register(self, name: str, func: Callable[..., Any]):
        self.tools[name] = func

    def execute(self, name: str, *args, **kwargs) -> Any:
        if name not in self.tools:
            raise KeyError(f"Tool '{name}' is not registered")
        return self.tools[name](*args, **kwargs)

    def list_tools(self):
        return list(self.tools.keys())


@tool
def search_web(query: str) -> str:
    """Search web using TavilySearchResults, returning string output (top 3)."""
    if TavilySearchResults is None:
        return "TavilySearchResults library not installed."

    if not TAVILY_API_KEY:
        return "TAVILY_API_KEY missing in environment."

    search = TavilySearchResults(max_results=3, api_key=TAVILY_API_KEY)
    result = search.invoke(query)
    return str(result)


@tool
def summarize_text(content: str) -> str:
    """Summarize text content into a short summary (first 500 chars)."""
    if not content:
        return ""
    return content[:500]
