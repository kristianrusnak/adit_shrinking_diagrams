import enum
import random

from app.services.shrinking_algorithms.preprocessing.preprocess_base import (
    AttributeRemovalStrategy,
)
from app.services.shrinking_algorithms.preprocessing.types import Visibility, ParsedPUML


class RandomAttributeRemovalStrategy(AttributeRemovalStrategy):
    def __init__(self, threshold: float):
        if not (0 <= threshold <= 1):
            raise ValueError("Threshold must be between 0 and 1")

        self.threshold = threshold

    def select_to_remove(
        self, class_name: str, attributes: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        k = int(len(attributes) * self.threshold)
        return random.sample(attributes, k)


class RemoveAttributesByVisibilityStrategy(AttributeRemovalStrategy):
    def __init__(self, visibility: Visibility):
        self.visibility = visibility

    def select_to_remove(
        self, class_name: str, attributes: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        return [attr for attr in attributes if attr["visibility"] == self.visibility]
