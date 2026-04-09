import random

from app.services.shrinking_algorithms.preprocessing.preprocess_base import (
    MethodRemovalStrategy,
)


from app.services.shrinking_algorithms.preprocessing.types import ParsedPUML, Visibility


class RandomMethodRemovalStrategy(MethodRemovalStrategy):
    def __init__(self, threshold: float):
        if not (0 <= threshold <= 1):
            raise ValueError("Threshold must be between 0 and 1")

        self.threshold = threshold

    def select_to_remove(
        self, class_name: str, methods: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        k = int(len(methods) * self.threshold)
        return random.sample(methods, k)


class RemoveMethodsByVisibilityStrategy(MethodRemovalStrategy):
    def __init__(self, visibility: Visibility):
        self.visibility = visibility

    def select_to_remove(
        self, class_name: str, methods: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        return [method for method in methods if method["visibility"] == self.visibility]


class RemoveGettersAndSettersStrategy(MethodRemovalStrategy):
    def __init__(self):
        pass

    # TODO: this is not so good because different languages have different syntax
    # ie:
    # setX()
    # set_x()
    # setup() -> false positive
    # full version should accomodate for all cases instead of just checking with startswith
    def select_to_remove(
        self, class_name: str, methods: list[dict], parsed_puml: ParsedPUML
    ) -> list[dict]:
        return [
            method
            for method in methods
            if method["name"].lower().startswith("get")
            or method["name"].lower().startswith("set")
        ]
