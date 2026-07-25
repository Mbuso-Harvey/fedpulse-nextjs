from fastapi import APIRouter, Depends
from models.schemas import RenewalResponse
from typing import List, Dict, Any

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])

PIPELINE_DB = [
    {
        "id": "item-1",
        "title": "Cloud Modernization Initiative",
        "referenceNumber": "HQ-2024-001",
        "agency": "Department of Defense",
        "value": 45000000,
        "stage": "qualification",
        "winProbability": 35,
        "recommendation": "BID",
        "teamingPartner": "TechCorp Solutions",
        "owner": "Sarah Jenkins",
        "dueDate": "2024-11-15",
        "assignedTeam": ["SJ", "MR", "TK"],
        "nextMilestone": "Gate 1 Review",
        "riskCount": 3,
        "notes": "Waiting on final RFP release."
    },
    {
        "id": "item-2",
        "title": "Enterprise Cybersecurity Audit",
        "referenceNumber": "SEC-2024-892",
        "agency": "Department of Homeland Security",
        "value": 12500000,
        "stage": "proposal",
        "winProbability": 68,
        "recommendation": "BID",
        "owner": "Marcus Chen",
        "dueDate": "2024-10-01",
        "assignedTeam": ["MC", "AL"],
        "nextMilestone": "Red Team Review",
        "riskCount": 1,
        "notes": "Strong past performance gives us an edge."
    },
    {
        "id": "item-3",
        "title": "Legacy Systems Migration",
        "referenceNumber": "HHS-2024-334",
        "agency": "Health and Human Services",
        "value": 8900000,
        "stage": "teaming",
        "winProbability": 45,
        "recommendation": "TEAM",
        "teamingPartner": "MedTech Systems",
        "owner": "Alex Rivera",
        "dueDate": "2024-12-01",
        "assignedTeam": ["AR", "SJ"],
        "nextMilestone": "Partner Agreement Sign",
        "riskCount": 2,
        "notes": "Need an 8(a) partner to qualify."
    },
    {
        "id": "item-4",
        "title": "Data Center Consolidation",
        "referenceNumber": "VA-2024-112",
        "agency": "Veterans Affairs",
        "value": 156000000,
        "stage": "qualification",
        "winProbability": 15,
        "recommendation": "NO-BID",
        "owner": "Thomas Wright",
        "dueDate": "2025-01-15",
        "assignedTeam": ["TW"],
        "nextMilestone": "No-Bid Decision Matrix",
        "riskCount": 8,
        "notes": "Too many incumbent advantages, high risk."
    }
]

@router.get("")
async def get_pipeline() -> List[Dict[str, Any]]:
    # Simulated database fetch for the capture pipeline
    return PIPELINE_DB
