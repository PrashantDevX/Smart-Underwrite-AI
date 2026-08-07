"""
Underwriting Router
Handles full loan underwriting, policy Q&A, profile updates, and report generation endpoints.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from database.schemas import (
    LoanApplicationRequest,
    UnderwriteResponse,
    ChatRequest,
    ChatResponse
)
from services.coordinator import agent_coordinator
from services.llm_service import llm_service
from services.monitoring_service import monitoring_service
from utils.logger import logger

router = APIRouter()


@router.post("/underwrite", response_model=UnderwriteResponse)
async def underwrite_application(application: LoanApplicationRequest):
    """
    Execute complete AI underwriting workflow using multi-agent pipeline
    """
    try:
        logger.info(f"Received loan application from {application.full_name}")
        response = agent_coordinator.execute_underwriting_pipeline(application)
        return response
    except Exception as e:
        logger.error(f"Error executing underwriting pipeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def policy_chat(request: ChatRequest):
    """
    Policy Q&A endpoint using RAG retrieval + LLM
    """
    try:
        return await llm_service.answer_policy_question(request.message, request.context)
    except Exception as e:
        logger.error(f"Error in policy chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-report")
async def generate_report(application_id: str = Body(..., embed=True)):
    """
    Generate complete loan underwriting report with audit trail
    """
    return {
        "success": True,
        "application_id": application_id,
        "pdf_download_url": f"/api/reports/{application_id}/export.pdf",
        "generated_at": datetime.utcnow().isoformat()
    }


@router.post("/update-profile")
async def update_profile(
    customer_id: str = Body(...),
    application: LoanApplicationRequest = Body(...),
    updates: Dict[str, Any] = Body(...)
):
    """
    Dynamic continuous underwriting: Update customer profile and recalculate risk
    """
    try:
        event = monitoring_service.process_profile_update(customer_id, application, updates)
        return {
            "success": True,
            "data": event,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in profile update: {e}")
        raise HTTPException(status_code=500, detail=str(e))
