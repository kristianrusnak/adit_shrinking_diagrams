import random

from app.services.shrinking_algorithms.preprocessing.preprocess_base import (
    EdgeRemovalStrategy,
)

from app.services.shrinking_algorithms.preprocessing.types import ParsedPUML


class RandomEdgeRemovalStrategy(EdgeRemovalStrategy):
    def __init__(self, threshold: float):
        if not (0 <= threshold <= 1):
            raise ValueError("Threshold must be between 0 and 1")

        self.threshold = threshold

    def select_to_remove(
        self, edges: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        k = int(len(edges) * self.threshold)
        return random.sample(edges, k)
