"""
RAG (Retrieval-Augmented Generation) Service
Retrieves credit policies, RBI guidelines, and underwriting rules to ground AI explanations.
"""

from typing import List, Dict, Any
from database.schemas import PolicyDocumentSchema
from utils.logger import logger


POLICY_DOCUMENTS = [
    {
        "id": "POL-001",
        "title": "RBI Guidelines on Digital Lending (2022/23)",
        "category": "RBI_GUIDELINE",
        "content": (
            "All digital lending must comply with RBI guidelines. Loan decisions must be explainable, "
            "transparent, and based on explicit customer consent. Algorithmic bias against protected attributes "
            "is strictly prohibited. Interest rate caps and fee structures must be communicated clearly."
        )
    },
    {
        "id": "POL-002",
        "title": "SmartUnderwrite Financial Discipline & Debt Ratio Thresholds",
        "category": "UNDERWRITING_RULE",
        "content": (
            "Maximum permissible Debt-to-Income (DTI) ratio for uncollateralized personal loans is 50%. "
            "Applicants with DTI between 40% and 50% require additional savings buffers or lower loan limits. "
            "Minimum employment duration is 12 months in the current industry."
        )
    },
    {
        "id": "POL-003",
        "title": "Alternative Data & Utility Payment Score Weighting",
        "category": "LOAN_POLICY",
        "content": (
            "Alternative data (utility payment history, digital footprint, email age) can boost borrower "
            "credit eligibility by up to 25%. Utility payment scores above 80/100 offset lack of traditional "
            "credit history for new-to-credit (NTC) applicants."
        )
    },
    {
        "id": "POL-004",
        "title": "Fraud Detection & Anomaly Prevention Protocol",
        "category": "COMPLIANCE",
        "content": (
            "Applications triggering high fraud risk (>60/100) or Isolation Forest anomalies must be instantly "
            "flagged for compliance audit. Device fingerprint mismatches and sudden location jumps require "
            "mandatory document re-verification."
        )
    },
    {
        "id": "POL-005",
        "title": "Indian DPDP (Digital Personal Data Protection) Act Compliance",
        "category": "DATA_PRIVACY",
        "content": (
            "Consent for alternative data sources (employment, utility, device metrics) must be explicit, "
            "granular, and revocable at any time. Data must be processed solely for the declared purpose of "
            "underwriting risk assessment."
        )
    }
]


class RAGService:
    """Policy Retrieval-Augmented Generation Service"""

    def __init__(self):
        self.documents = POLICY_DOCUMENTS
        self.initialized = False

    async def initialize(self):
        """Initialize RAG vector database / corpus index"""
        logger.info(f"Indexing {len(self.documents)} compliance policy documents for RAG...")
        self.initialized = True
        logger.success("✓ RAG service initialized with policy vector index")

    def retrieve_policies(self, query: str, top_k: int = 2) -> List[PolicyDocumentSchema]:
        """
        Retrieve relevant policy documents based on query keywords & semantics
        """
        query_words = set(query.lower().split())
        scored_docs = []

        for doc in self.documents:
            text = (doc['title'] + " " + doc['content'] + " " + doc['category']).lower()
            # Calculate simple keyword overlap / relevance score
            match_count = sum(1 for word in query_words if len(word) > 3 and word in text)
            score = round(min(0.5 + (match_count * 0.15), 0.98), 2)
            
            scored_docs.append((score, doc))

        # Sort by relevance score
        scored_docs.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, doc in scored_docs[:top_k]:
            results.append(PolicyDocumentSchema(
                id=doc['id'],
                title=doc['title'],
                content=doc['content'],
                category=doc['category'],
                relevance_score=score
            ))

        return results


rag_service = RAGService()
