from app.services.puml_interpreter.context import InterpreterContext
from app.services.puml_interpreter.exceptions import PumlParseException
from app.services.puml_interpreter.expression import Expression
from app.services.puml_interpreter.types import ClassNameExtractor


class ClassDeclarationExpression(Expression):
    def __init__(self, class_names: set[str], class_name_extractor: ClassNameExtractor):
        # Match the longest keywords first, e.g. "abstract class" before "abstract".
        self.class_names = sorted(class_names, key=len, reverse=True)
        self.class_name_extractor = class_name_extractor

    def interpret(self, line: str, line_number: int, context: InterpreterContext) -> bool:
        for keyword in self.class_names:
            if not line.startswith(keyword):
                continue

            class_name = self.class_name_extractor(keyword, line)
            if not class_name:
                raise PumlParseException("Invalid class declaration", line_number, line)

            if class_name in context.classes:
                raise PumlParseException(f"Duplicate class '{class_name}'", line_number, line)

            context.add_class(class_name, line.endswith("{"))
            return True

        return False

