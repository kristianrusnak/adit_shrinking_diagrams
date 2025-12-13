from pydantic import BaseModel
from enum import StrEnum


class Algorithm(StrEnum):
    evolution = "evol"
    kruskals = "kruskals"
    none = "none"


class ConfigRequest(BaseModel):
    algorithm: Algorithm
