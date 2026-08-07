"""
Local LLM & Response Generation Service
Integrates local Ollama (Llama 3 / Llama 2 / Mistral) with RAG policy context retrieval,
with instant structured fallback if Ollama is offline.
"""

import httpx
from typing import List, Dict, Any, Optional
from database.schemas import ChatResponse, PolicyDocumentSchema
from services.rag_service import rag_service
from config.settings import settings
from utils.logger import logger


class LLMService:
    """Local Open-Source LLM Service with Policy RAG Integration"""

    def __init__(self):
        self.ollama_url = getattr(settings, 'OLLAMA_BASE_URL', 'http://localhost:11434')
        self.ollama_model = getattr(settings, 'OLLAMA_MODEL', 'llama3')

    async def answer_policy_question(
        self, 
        message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> ChatResponse:
        """
        Answer customer or underwriter policy questions using RAG retrieval & local Ollama LLM
        """
        # Retrieve relevant policies using RAG
        sources: List[PolicyDocumentSchema] = rag_service.retrieve_policies(message, top_k=2)
        
        policy_context = "\n\n".join([f"Document [{doc.title}]: {doc.content}" for doc in sources])

        # Attempt Ollama local generation
        ollama_response = await self._generate_with_ollama(message, policy_context)
        if ollama_response:
            logger.info("Generated policy answer using local Ollama LLM")
            return ChatResponse(response=ollama_response, sources=sources)

        # Fallback to structured RAG rule engine
        query_lower = message.lower()
        if "rate" in query_lower or "interest" in query_lower:
            response_text = (
                "Based on RBI digital lending guidelines and SmartUnderwrite policies, interest rates range from "
                "8.5% to 12.5% p.a. depending on your calculated risk tier, credit history, and alternative data score. "
                "All fees are disclosed upfront without hidden processing charges."
            )
        elif "eligibility" in query_lower or "eligible" in query_lower or "criteria" in query_lower:
            response_text = (
                "Loan eligibility requires a minimum monthly income of ₹30,000, employment history of at least 12 months, "
                "and a Debt-to-Income (DTI) ratio under 50%. Alternative signals like utility payment consistency "
                "and digital trust scores can significantly boost eligibility for new-to-credit applicants."
            )
        elif "document" in query_lower or "proof" in query_lower:
            response_text = (
                "Standard required documents include PAN card, Aadhaar / identity proof, last 3 months bank statements, "
                "and salary slips. If requested by the AI decision engine, additional tax returns (Form 16) may be needed."
            )
        elif "fairness" in query_lower or "bias" in query_lower:
            response_text = (
                "SmartUnderwrite enforces strict non-discrimination audits using Fairlearn standards. Protected attributes "
                "such as gender, age bracket, and geographical location are strictly isolated and do not influence loan decisions."
            )
        else:
            response_text = (
                f"SmartUnderwrite AI operates under strict RBI lending guidelines. Regarding your inquiry '{message}': "
                "Our platform evaluates loan applications using LightGBM risk models, Isolation Forest fraud detection, "
                "and alternative data features. Let me know if you need specific details on eligibility, interest rates, or policy rules."
            )

        logger.info(f"LLM Service generated response grounded on {len(sources)} policy documents (Fallback Mode)")
        return ChatResponse(
            response=response_text,
            sources=sources
        )

    async def _generate_with_ollama(self, query: str, context: str) -> Optional[str]:
        """Call local Ollama endpoint if available"""
        prompt = (
            f"You are SmartUnderwrite AI, an expert banking underwriting assistant.\n"
            f"Use the following official loan policies and RBI guidelines to answer the user query concisely.\n\n"
            f"Context:\n{context}\n\n"
            f"User Query: {query}\n\n"
            f"Answer:"
        )
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.ollama_model,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("response", "").strip()
        except Exception as e:
            logger.debug(f"Ollama connection check failed or timed out: {e}")
        return None


llm_service = LLMService()
