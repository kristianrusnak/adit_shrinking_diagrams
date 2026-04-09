from app.services.shrinking_algorithms.preprocessing.preprocess_base import (
    PreprocessStep,
    ClassRemovalStrategy,
    EdgeRemovalStrategy,
    AttributeRemovalStrategy,
    MethodRemovalStrategy,
)

from app.services.shrinking_algorithms.preprocessing.types import ParsedPUML
from copy import deepcopy


# Concrete implementations for steps
# Each step has different constructor that takes in asbtract strategy base type
class RemoveClassesStep(PreprocessStep):
    def __init__(self, strategy: ClassRemovalStrategy) -> None:
        self.strategy = strategy

    def apply(self, parsed_puml: ParsedPUML) -> ParsedPUML:
        res = deepcopy(parsed_puml)

        to_remove = set(
            self.strategy.select_to_remove(
                list(parsed_puml["classes"].keys()), parsed_puml
            )
        )

        for cls in to_remove:
            del res["classes"][cls]

        res["edges"] = [
            edge
            for edge in res["edges"]
            if edge["source"] not in to_remove and edge["target"] not in to_remove
        ]

        return res


class RemoveEdgesStep(PreprocessStep):
    def __init__(self, strategy: EdgeRemovalStrategy) -> None:
        self.strategy = strategy

    def apply(self, parsed_puml: ParsedPUML) -> ParsedPUML:
        res = deepcopy(parsed_puml)

        to_remove = set(
            self.strategy.select_to_remove(parsed_puml["edges"], parsed_puml)
        )

        res["edges"] = [edge for edge in res["edges"] if edge not in to_remove]

        return res


class RemoveAttributesStep(PreprocessStep):
    def __init__(self, strategy: AttributeRemovalStrategy) -> None:
        self.strategy = strategy

    def apply(self, parsed_puml: ParsedPUML) -> ParsedPUML:
        res = deepcopy(parsed_puml)

        for cls, body in parsed_puml["classes"].items():
            attrs_to_remove = self.strategy.select_to_remove(
                cls, body.get("attributes", []), parsed_puml
            )

            res["classes"][cls]["attributes"] = [
                attr
                for attr in body.get("attributes", [])
                if attr not in attrs_to_remove
            ]

        return res


class RemoveMethodsStep(PreprocessStep):
    def __init__(self, strategy: MethodRemovalStrategy) -> None:
        self.strategy = strategy

    def apply(self, parsed_puml: ParsedPUML) -> ParsedPUML:
        res = deepcopy(parsed_puml)

        for cls, body in parsed_puml["classes"].items():
            methods_to_remove = self.strategy.select_to_remove(
                cls, body.get("methods", []), parsed_puml
            )

            res["classes"][cls]["methods"] = [
                method
                for method in body.get("methods", [])
                if method not in methods_to_remove
            ]

        return res
