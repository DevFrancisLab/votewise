from dataclasses import dataclass, field
from typing import Any, Dict, List
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage


class MessagesState:
    """Base message state for LangGraph conversation management."""

    def __init__(self):
        self.messages: List[BaseMessage] = []

    def add_message(self, role: str, text: str):
        """Add a message to the conversation."""
        if role.lower() == "user" or role.lower() == "human":
            self.messages.append(HumanMessage(content=text))
        elif role.lower() == "assistant" or role.lower() == "ai":
            self.messages.append(AIMessage(content=text))
        else:
            # Default to AIMessage for assistant-like roles
            self.messages.append(AIMessage(content=text))

    def get_messages(self) -> List[BaseMessage]:
        return list(self.messages)

    def clear_messages(self):
        self.messages.clear()


@dataclass
class LangGraphState(MessagesState):
    next_agent: str = ""
    user_question: str = ""
    candidate_data: str = ""
    pulse_data: str = ""
    civic_data: str = ""
    final_answer: str = ""

    def __post_init__(self):
        # Ensure the MessagesState is properly initialized
        super().__init__()

    def set_next_agent(self, agent: str):
        self.next_agent = agent

    def set_user_question(self, question: str):
        self.user_question = question

    def set_candidate_data(self, data: str):
        self.candidate_data = data

    def set_pulse_data(self, data: str):
        self.pulse_data = data

    def set_civic_data(self, data: str):
        self.civic_data = data

    def set_final_answer(self, answer: str):
        self.final_answer = answer
