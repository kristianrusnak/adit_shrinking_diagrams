from abc import ABC, abstractmethod
from typing import Any, Dict
import copy


class ShrinkingAlgorithm(ABC):
    """
    Interface for all diagram-shrinking algorithms.
    """

    def __init__(self, **params: Any) -> None:
        """
        Optional shared init – you can store hyperparameters here.
        """
        if "preprocess" in params:
            self.should_preprocess = params["preprocess"]
        else:
            self.should_preprocess = False

        self.initialize(**params)

    @abstractmethod
    def initialize(self, **params: Any) -> None:
        """
        Initialize the algorithm with parameters (weights, thresholds, etc.).
        """

    @abstractmethod
    def compute(self, parsed_puml: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run the algorithm on parsed PUML data and return the reduced PUML data.
        """
        raise NotImplementedError

    def preprocess(self, parsed_puml: Dict[str, Any]) -> Dict[str, Any]:
        """
        Preprocess the parsed PUML data before running the algorithm.
        For now only removes methods and attributes.
        Later we can add some other steps.
        """

        # NOTE:
        #
        # idea:
        # 1. pipes and filters
        # method chaining? fluent interface? builder pattern?
        # res_puml = f(g(h(parsed_puml)))
        # res_puml = parsed_puml.h().g().f()
        #
        # we might wanna specify individual steps somehow
        # composite
        # AbstractStep
        # RemoveClassesStep
        # RemoveMethodsStep
        # RemoveAttributesStep
        #
        # another idea:
        # There can be different strategies for each step:
        # ex:
        # RemoveClasses only if they have no methods
        # RemoveMethods only if they have no attributes
        #
        # RemoveX based on some graph metrics
        #
        # So pipelines + steps composite, steps can be also strategies??
        #
        # https://www.plantuml.com/plantuml/png/dP3BIaGn38RtUOeiHwJW-Z0C8xeH50xE4tJQWC6UjZIP0rvyTyy51Ml1owgb_PBy-VQYjkXf222F7BCjTa0NhCYbQk7ZIUd6fNZWPy8BWEK7hm9JL01x52tMwLg0VQ5SaYEHWrB65q0yjpc7fqssHSZtqvGEhzdfsNh0sqV7UnhII9yZ_zlWZlGX-RzKrybxpXGuqb9kH2bBXxSiklswtMxfxlrytynOLwq_pHWJ-nahIxQVo5_5NSsZCRlQDa3ri7qrfkcr1TR-sbJ34q33NPhGx_ds5Fsqqpi0
        #
        #
        # if pipeline is composite then
        # pipeline1 = [stepA, stepB]
        # pipeline2 = [pileine1, stepC]
        #
        # can work
        #
        #
        # Another idea: build pipeline with builder
        # pipeline = (
        #   Builder()
        #   .remove_classes()
        #   .remove_attributes()
        #   .build()
        # )
        #
        # Preliminary implementation - hardcode remove methods and attrs only

        # parsed_puml is pbr
        # maybe we wanna reuse parsed_puml in the future
        cp = copy.deepcopy(parsed_puml)

        classes = cp.get("classes", {})
        for cls, body in classes.items():
            print(cls)
            if cls == "Test":
                print(body)
            if "methods" in body:
                body["methods"] = []
            if "attributes" in body:
                body["attributes"] = []

            print(body)

        return cp
