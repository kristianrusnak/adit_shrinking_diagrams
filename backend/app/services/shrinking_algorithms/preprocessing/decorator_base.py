from abc import ABC
from typing import Any, Dict

from app.services.shrinking_algorithms.base import ShrinkingAlgorithm


class AlgorithmDecorator(ShrinkingAlgorithm, ABC):
    def __init__(self, wrapped: ShrinkingAlgorithm, **params: Any) -> None:
        self.wrapped = wrapped
        super().__init__(**params)

    def initialize(self, **params: Any) -> None:
        self.wrapped.initialize(**params)

    def compute(self, parsed_puml: Dict[str, Any]) -> Dict[str, Any]:
        return self.wrapped.compute(parsed_puml)
