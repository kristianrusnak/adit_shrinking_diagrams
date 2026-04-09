import random

from app.services.shrinking_algorithms.preprocessing.preprocess_base import (
    ClassRemovalStrategy,
)

from app.services.shrinking_algorithms.preprocessing.types import ParsedPUML


class RandomClassRemovalStrategy(ClassRemovalStrategy):

    def __init__(self, threshold: float):
        if not (0 <= threshold <= 1):
            raise ValueError("Threshold must be between 0 and 1")

        self.threshold = threshold

    def select_to_remove(self, items: list[str], parsed_puml: ParsedPUML) -> list[str]:
        k = int(len(items) * self.threshold)
        return random.sample(items, k)


class RemoveEmptyClassesStrategy(ClassRemovalStrategy):

    def __init__(self):
        pass

    def select_to_remove(self, items: list[str], parsed_puml: ParsedPUML) -> list[str]:
        return [
            item
            for item in items
            if not parsed_puml["classes"][item]["attributes"]
            and not parsed_puml["classes"][item]["methods"]
        ]


class RemoveIsolatedClassesStrategy(ClassRemovalStrategy):
    def __init__(self):
        pass

    def select_to_remove(self, items: list[str], parsed_puml: ParsedPUML) -> list[str]:
        return [
            item
            for item in items
            if not any(
                [
                    edge["target"] == item or edge["source"] == item
                    for edge in parsed_puml["edges"]
                ]
            )
        ]


class RemoveLeafClassesStrategy(ClassRemovalStrategy):
    def __init__(self):
        pass

    def select_to_remove(self, items: list[str], parsed_puml: ParsedPUML) -> list[str]:
        return [
            item
            for item in items
            if len(
                [
                    edge
                    for edge in parsed_puml["edges"]
                    if edge["target"] == item or edge["source"] == item
                ]
            )
            == 1
        ]


class RemoveLowDegreeClassesStrategy(ClassRemovalStrategy):
    def __init__(self, degree: int):
        self.degree = degree

    def select_to_remove(self, items: list[str], parsed_puml: ParsedPUML) -> list[str]:
        return [
            item
            for item in items
            if len(
                [
                    edge
                    for edge in parsed_puml["edges"]
                    if edge["target"] == item or edge["source"] == item
                ]
            )
            <= self.degree
        ]
