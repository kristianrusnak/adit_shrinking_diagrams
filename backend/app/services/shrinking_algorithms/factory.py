import os
from typing import Any
from app.services.shrinking_algorithms.base import ShrinkingAlgorithm
from app.services.shrinking_algorithms.kruskal_algorithm import KruskalsAlgorithm
from app.services.shrinking_algorithms.genetic_algorithm import GeneticAlgorithm

DEFAULT_ALGO = "kruskal"
ENV_VAR_NAME = "SHRINKING_ALGORITHM"


def get_algorithm(
    algorithm: str | None = None, **shared_params: Any
) -> ShrinkingAlgorithm:
    """
    Factory that reads env var and returns the right algorithm instance.
    """
    if not algorithm:
        name = os.getenv(ENV_VAR_NAME, DEFAULT_ALGO).lower()
    else:
        name = algorithm

    # NOTE: this is a bit confusing ShrinkingAlgorithm class has
    # __init__ that calls initialize()
    # later in the code we reinitialize with different params
    # 2x config read IO overhead

    if name == "kruskal":
        return KruskalsAlgorithm(**shared_params)
    if name == "genetic":
        return GeneticAlgorithm(**shared_params)

    # later: add more algorithms here
    raise ValueError(f"Unknown algorithm: {name!r}")
