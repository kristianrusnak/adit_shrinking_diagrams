from app.services.puml_interpreter.context import InterpreterContext
from app.services.puml_interpreter.exceptions import PumlParseException
from app.services.puml_interpreter.expression import Expression


class DirectiveExpression(Expression):
    def interpret(self, line: str, line_number: int, context: InterpreterContext) -> bool:
        if line == "@startuml":
            if context.start_found:
                raise PumlParseException("Duplicate @startuml directive", line_number, line)
            context.start_found = True
            return True

        if line == "@enduml":
            if not context.start_found:
                raise PumlParseException("@enduml found before @startuml", line_number, line)
            if context.in_class_body:
                raise PumlParseException("Unclosed class body before @enduml", line_number, line)
            context.end_found = True
            return True

        return False

