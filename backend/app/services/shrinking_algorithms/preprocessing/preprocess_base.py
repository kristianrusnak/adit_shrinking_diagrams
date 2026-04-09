from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict

from app.services.shrinking_algorithms.preprocessing.types import ParsedPUML


# Context for the strategy
class PreprocessStep(ABC):
    """Abstract base for all preprocessing steps."""

    @abstractmethod
    def apply(self, parsed_puml: ParsedPUML) -> ParsedPUML:
        raise NotImplementedError


# Abstract base for all types of strategies:
# Class removal
# Edge removal
# Attribute removal
class ClassRemovalStrategy(ABC):
    """Strategy interface for removing classes."""

    @abstractmethod
    def select_to_remove(self, items: list[str], parsed_puml: ParsedPUML) -> list[str]:
        raise NotImplementedError


class EdgeRemovalStrategy(ABC):
    """Strategy interface for removing edges."""

    @abstractmethod
    def select_to_remove(
        self, edges: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        raise NotImplementedError


class AttributeRemovalStrategy(ABC):
    """Strategy interface for removing attributes."""

    @abstractmethod
    def select_to_remove(
        self, class_name: str, attributes: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        raise NotImplementedError


class MethodRemovalStrategy(ABC):
    """Strategy interface for removing methods."""

    @abstractmethod
    def select_to_remove(
        self, class_name: str, methods: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        raise NotImplementedError
