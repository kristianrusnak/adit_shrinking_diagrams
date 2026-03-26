from abc import ABC, abstractmethod

from app.services.puml_interpreter.context import InterpreterContext


class Expression(ABC):
    @abstractmethod
    def interpret(self, line: str, line_number: int, context: InterpreterContext) -> bool:
        raise NotImplementedError

