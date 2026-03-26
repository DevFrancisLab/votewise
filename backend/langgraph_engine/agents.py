from typing import Dict, List

from langgraph.graph import StateGraph
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph_engine.state import LangGraphState
from langgraph_engine.config import llm
from langgraph_engine.tools import search_web


## Structured candidate profiles with profile pictures and links
CANDIDATE_PROFILES = [
    {
        "name": "Alice Johnson",
        "position": "MP - Kilimani",
        "party": "Orange Democratic Movement (ODM)",
        "focus": ["Sustainable Development", "Education"],
        "bio": "Focus on sustainable development, education, and green infrastructure.",
        "profile_picture": "https://example.com/images/alice_johnson.jpg",
        "profile_link": "https://politics.example.com/alice-johnson",
    },
    {
        "name": "Bob Smith",
        "position": "MP - Kilimani",
        "party": "United Democratic Alliance (UDA)",
        "focus": ["Economic Growth", "Job Creation"],
        "bio": "Prioritize economic growth, job creation, and public safety.",
        "profile_picture": "https://example.com/images/bob_smith.jpg",
        "profile_link": "https://politics.example.com/bob-smith",
    },
    {
        "name": "Carol Davis",
        "position": "MP - Kilimani",
        "party": "Roots Party of Kenya",
        "focus": ["Environmental Protection", "Renewable Energy"],
        "bio": "Environmental protection, renewable energy, and social programs.",
        "profile_picture": "https://example.com/images/carol_davis.jpg",
        "profile_link": "https://politics.example.com/carol-davis",
    },
    {
        "name": "David Muhozi",
        "position": "MP - Kilimani",
        "party": "Jubilee Party",
        "focus": ["Local Infrastructure", "Water Access"],
        "bio": "Local infrastructure, water access, and community safety.",
        "profile_picture": "https://example.com/images/david_muhozi.jpg",
        "profile_link": "https://politics.example.com/david-muhozi",
    },
    {
        "name": "Emma Karanja",
        "position": "MP - Kilimani",
        "party": "Kenya Kwanza Alliance",
        "focus": ["Affordable Housing", "Healthcare"],
        "bio": "Affordable housing, healthcare, and education outreach.",
        "profile_picture": "https://example.com/images/emma_karanja.jpg",
        "profile_link": "https://politics.example.com/emma-karanja",
    },
]

pulse_data = "Jobs (60%), Cost of Living (25%)"

civic_reports = "Candidate A: strong engagement, some concerns"


def candidate_agent(state: LangGraphState) -> Dict:
    """Candidate agent provides structured candidate information."""

    # Build candidate_data string from CANDIDATE_PROFILES
    candidate_items = []
    for candidate in CANDIDATE_PROFILES:
        candidate_items.append(
            f"{candidate['name']} ({candidate['position']}):\n"
            f"- Party: {candidate['party']}\n"
            f"- Focus: {', '.join(candidate['focus'])}\n"
            f"- Bio: {candidate['bio']}\n"
            f"- Profile: {candidate['profile_link']}\n"
            f"- Photo: {candidate['profile_picture']}"
        )

    candidate_data = "\n\n".join(candidate_items)
    state.candidate_data = candidate_data
    state.next_agent = "pulse_agent"

    # Save in state messages for next steps
    state.add_message("assistant", candidate_data)

    return {
        "messages": state.messages,
        "candidate_data": state.candidate_data,
        "next_agent": state.next_agent,
    }


def pulse_agent(state: LangGraphState) -> Dict:
    """Pulse agent: provides voter priorities."""
    pulse_data = "Top voter priorities: economy, public safety, climate resilience, health care."
    state.pulse_data = pulse_data
    state.next_agent = "civic_agent"
    state.add_message("assistant", pulse_data)
    return {
        "messages": state.messages,
        "pulse_data": state.pulse_data,
        "next_agent": state.next_agent,
    }


def civic_agent(state: LangGraphState) -> Dict:
    """Civic agent: analyzes civic signals and may search for additional context."""
    system_msg = SystemMessage("You analyze civic signals and may search for additional context. Never fabricate data. If unsure, respond: 'I don't have enough verified data to answer that yet.' Only answer questions related to Kenyan elections, candidates, and voting information. For any other topics, respond: 'I can only assist with Kenyan election and voting information.'")
    convo_messages = getattr(state, "messages", [])

    try:
        # Bind search_web tool to LLM
        llm_with_tools = llm.bind_tools([search_web]) if hasattr(llm, "bind_tools") else llm
        # Invoke LLM with civic analysis system prompt
        response = llm_with_tools.invoke([system_msg] + convo_messages)
        if hasattr(response, "content"):
            civic_data = response.content
        elif isinstance(response, dict):
            civic_data = response.get("content", "")
        else:
            civic_data = str(response)
    except Exception as e:
        civic_data = f"Civic analysis failed: {e}"

    state.civic_data = civic_data
    state.next_agent = "reasoning_agent"
    state.add_message("assistant", civic_data)

    return {
        "messages": state.messages,
        "civic_data": state.civic_data,
        "next_agent": state.next_agent,
    }


def reasoning_agent(state: LangGraphState) -> Dict:
    """Reasoning agent: combines all data via LLM and produces final answer."""

    # Structured candidate data from CANDIDATE_PROFILES
    structured_candidates = "\n\n".join(
        [
            f"{c['name']} ({c['position']}):\n"
            f"- Party: {c['party']}\n"
            f"- Focus: {', '.join(c['focus'])}\n"
            f"- Bio: {c['bio']}\n"
            f"- Profile: {c['profile_link']}\n"
            f"- Photo: {c['profile_picture']}"
            for c in CANDIDATE_PROFILES
        ]
    )

    system_msg = SystemMessage(
        """You are a Kenyan civic assistant.

Context:
- Elections in Kenya
- Positions: MCA, MP, Governor, Senator, President
- Locations: Counties, Constituencies, Wards

Answer questions directly using the provided data.
Only use the candidates listed above. Do not introduce new names.
If asked about unknown candidates, respond: "I don't have data for that candidate yet."
If user asks about administrative divisions, boundaries, or governance structures of locations: Only answer if data exists, otherwise say: "Data for that area is not available yet."
Keep responses concise: Maximum 5 bullet points or 5 sentences.
Do not include greetings, introductions, or assistant personality text."""
    )

    # Build user message combining all inputs
    user_prompt = (
        f"User question: {state.user_question}\n\n"
        f"Available Candidates:\n{structured_candidates}\n\n"
        f"Candidate data:\n{state.candidate_data}\n\n"
        f"Voter priorities (pulse data):\n{state.pulse_data}\n\n"
        f"Civic analysis:\n{state.civic_data}\n\n"
        "Please provide a thoughtful, unbiased recommendation based on all this information."
    )
    user_msg = HumanMessage(user_prompt)

    convo_messages = getattr(state, "messages", [])

    try:
        # Invoke LLM with system prompt and all context
        response = llm.invoke([system_msg, user_msg] + convo_messages)
        if hasattr(response, "content"):
            final_answer = response.content
        elif isinstance(response, dict):
            final_answer = response.get("content", "")
        else:
            final_answer = str(response)

        # Enforce response length limit
        final_answer = final_answer[:500]

        # Clean response of any fluff
        import re
        final_answer = re.sub(r'^(Hello|Hi|Greetings|As an AI|As a civic advisor|I\'m here to help|Let me help you|Based on the information).*?[.!?]\s*', '', final_answer, flags=re.IGNORECASE | re.MULTILINE)
        final_answer = final_answer.strip()

        # Check if user asked about unknown locations (only for election-related questions)
        user_question_lower = state.user_question.lower()
        known_candidates = ["alice johnson", "bob smith", "carol davis", "david muhozi", "emma karanja", "johnson", "smith", "davis", "muhozi", "karanja"]
        asked_about_unknown = any(
            unknown in user_question_lower for unknown in ["unknown", "other", "different", "new"]
        ) and not any(known in user_question_lower for known in known_candidates)

        if asked_about_unknown or "i don't have data" in final_answer.lower():
            final_answer = "I don't have data for that candidate yet."

        # Location check only for election/candidate questions
        location_keywords = ["county", "constituency", "ward", "district", "location", "area", "region"]
        asked_about_location = any(loc in user_question_lower for loc in location_keywords)
        
        if asked_about_location:
            # Only apply location blocking if question is about candidates/elections
            is_about_elections = any(word in user_question_lower for word in ["candidate", "candidates", "election", "running", "mp", "mca", "governor", "senator", "president", "vote", "voting"])
            
            if is_about_elections:
                known_locations = ["kilimani", "nairobi"]
                mentions_known_location = any(known_loc in user_question_lower for known_loc in known_locations)
                if not mentions_known_location:
                    final_answer = "Data for that area is not available yet."

    except Exception as e:
        final_answer = f"Reasoning failed: {e}. Fallback: evaluate candidates by priority alignment and civic engagement."

    state.final_answer = final_answer
    state.next_agent = "end"
    state.add_message("assistant", final_answer)

    return {
        "messages": state.messages,
        "final_answer": state.final_answer,
        "next_agent": state.next_agent,
    }
