from app.services.puml_interpreter.context import InterpreterContext
from app.services.puml_interpreter.exceptions import PumlParseException
from app.services.puml_interpreter.expression import Expression


class ClassBodyEndExpression(Expression):
    def interpret(self, line: str, line_number: int, context: InterpreterContext) -> bool:
        if line != "}":
            return False

        if not context.in_class_body:
            raise PumlParseException("Unexpected class body closing brace", line_number, line)

        context.close_class()
        return True

