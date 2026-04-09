from enum import Enum
from typing import Any, Dict


class Visibility(Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    PROTECTED = "protected"
    PACKAGE = "package"

    def __str__(self):
        return self.value


ParsedPUML = Dict[str, Any]
