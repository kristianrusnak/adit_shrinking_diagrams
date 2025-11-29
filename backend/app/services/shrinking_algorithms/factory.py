import os
from app.services.shrinking_algorithms.base import ShrinkingAlgorithm
from app.services.shrinking_algorithms.kruskal_algorithm import KruskalAlgorithm

DEFAULT_ALGO = "kruskal"
ENV_VAR_NAME = "SHRINKING_ALGORITHM"


def get_algorithm() -> ShrinkingAlgorithm:
    """
    Factory that reads env var and returns the right algorithm instance.
    """
    name = os.getenv(ENV_VAR_NAME, DEFAULT_ALGO).lower()

    if name == "kruskal":
        return KruskalAlgorithm()

    # later: add more algorithms here
    raise ValueError(f"Unknown algorithm: {name!r}")
