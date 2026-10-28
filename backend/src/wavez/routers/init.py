"""POST /init — deploy the selected AI tool setup to a target project."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from wavez.core.deployment import resolve_agent_ids
from wavez.core.errors import WavezError
from wavez.core.service import init_project, repo_root
from wavez.routers.schemas import ErrorResponse, InitRequest, InitResponse

router = APIRouter()


@router.post("/init", response_model=InitResponse, responses={400: {"model": ErrorResponse}})
def init(request: InitRequest) -> InitResponse:
    """Deploy the selected tools and guideline templates to request.target_path.

    Args:
        request: Target path, tool selection, guideline selection, and optional
            skill selection (which agents to deploy; None deploys every agent).

    Returns:
        InitResponse describing what was deployed.

    Raises:
        HTTPException: 400 if no tool is selected or a source directory is missing.
    """
    agent_ids = resolve_agent_ids(request.skills) if request.skills is not None else None
    custom_agent_ids = resolve_agent_ids(request.custom_skills) if request.custom_skills is not None else None
    try:
        result = init_project(
            repo_root(),
            request.target_path,
            request.tools.to_domain(),
            request.guidelines.to_domain(),
            agent_ids,
            custom_agent_ids,
        )
    except WavezError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return InitResponse.from_domain(result)
