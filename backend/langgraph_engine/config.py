import os

from dataclasses import dataclass
from dotenv import load_dotenv

# Try to import the specified langchain_groq package
ChatGroq = None
try:
    from langchain_groq import ChatGroq
except ImportError:
    pass

# Fallback: try alternative import if first fails
if ChatGroq is None:
    try:
        from chatgroq import ChatGroq
    except ImportError:
        pass

# Load .env file (if present) and environment variables
load_dotenv()

print("GROQ KEY:", os.getenv("GROQ_API_KEY"))

# Capture TAVILY_API_KEY from environment too
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# Make sure key is loaded from environment; do not hardcode API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
if not GROQ_API_KEY:
    raise EnvironmentError("Missing required GROQ_API_KEY environment variable")
 
llm = None
if ChatGroq is not None:
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        api_key=GROQ_API_KEY,
    )
else:
    class _DummyLLM:
        def __init__(self):
            self.model = "llama-3.3-70b-versatile"
            self.temperature = 0.3

        def invoke(self, *args, **kwargs):
            """Fallback when ChatGroq is not available."""
            class MockResponse:
                def __init__(self):
                    self.content = "This is a mock response from OneTM AI. ChatGroq is not configured in this environment. Please install 'langchain-groq' and set GROQ_API_KEY in your .env file to enable AI features."
            return MockResponse()

        def bind_tools(self, tools):
            """Mock tool binding - returns self."""
            return self

        def generate(self, *args, **kwargs):
            raise RuntimeError("ChatGroq library is not installed")

    llm = _DummyLLM()


@dataclass
class LangGraphConfig:
    name: str = "OneTM-AI-LangGraph"
    max_agents: int = 5
    logging_enabled: bool = True
    default_tool_timeout: int = 30

    def validate(self):
        if self.max_agents < 1:
            raise ValueError("max_agents must be at least 1")
