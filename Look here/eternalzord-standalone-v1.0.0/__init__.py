"""
EternalZORD Standalone Package
A standalone memory and knowledge management system for AI agents.

Version: 1.0.0
Author: Project Moonshot
"""

__version__ = "1.0.0"
__author__ = "Project Moonshot"
__description__ = "Standalone EternalZORD memory and knowledge management system"

from .eternal_zord import EternalZord
from .memory_anchor import MemoryAnchor
from .artifact_retriever import ArtifactRetriever
from .protocol_registry import ProtocolRegistry

__all__ = [
    "EternalZord",
    "MemoryAnchor", 
    "ArtifactRetriever",
    "ProtocolRegistry"
]
