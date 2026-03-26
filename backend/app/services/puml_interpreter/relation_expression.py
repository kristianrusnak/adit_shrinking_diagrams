import re

from app.services.puml_interpreter.context import InterpreterContext
from app.services.puml_interpreter.exceptions import PumlParseException
from app.services.puml_interpreter.expression import Expression
from app.services.puml_interpreter.types import EdgeExtractor


class RelationExpression(Expression):
    def __init__(self, relations: dict[str, str], edge_extractor: EdgeExtractor):
        self.relations = relations
        self.edge_extractor = edge_extractor

    def interpret(self, line: str, line_number: int, context: InterpreterContext) -> bool:
        line_without_brackets = re.sub(r"\[.*?\]", "", line)

        for relation_key, relation_value in self.relations.items():
            if relation_key not in line_without_brackets:
                continue

            parts = line_without_brackets.split(relation_key)
            edge = self.edge_extractor(parts)
            source = edge.get("source")
            target = edge.get("target")

            if not source or not target:
                raise PumlParseException("Invalid relation declaration", line_number, line)

            if source not in context.classes or target not in context.classes:
                raise PumlParseException(
                    "Relation references undefined class", line_number, line
                )

            context.edges.append({"source": source, "target": target, "relation": relation_value})
            return True

        return False

