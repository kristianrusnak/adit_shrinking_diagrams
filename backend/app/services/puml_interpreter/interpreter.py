from app.services.puml_interpreter.class_body_end_expression import ClassBodyEndExpression
from app.services.puml_interpreter.class_declaration_expression import ClassDeclarationExpression
from app.services.puml_interpreter.class_member_expression import ClassMemberExpression
from app.services.puml_interpreter.context import InterpreterContext
from app.services.puml_interpreter.directive_expression import DirectiveExpression
from app.services.puml_interpreter.exceptions import PumlParseException
from app.services.puml_interpreter.relation_expression import RelationExpression
import re


class PumlInterpreter:
    def __init__(
        self,
        relations: dict[str, str],
        class_names: set[str],
    ):
        self.relations = relations
        self.class_names = class_names

        self.expressions = [
            DirectiveExpression(),
            ClassDeclarationExpression(class_names, self._extract_class_name),
            ClassBodyEndExpression(),
            ClassMemberExpression(self._parse_class_member),
            RelationExpression(relations, self._extract_edge_info),
        ]

    def parse(self, lines: list[str]) -> dict:
        context = InterpreterContext()
        in_block_comment = False

        for line_number, raw_line in enumerate(lines, start=1):
            line, in_block_comment = self._remove_comments(raw_line, in_block_comment)
            line = line.strip()

            if self._is_ignorable(line):
                continue

            handled = False
            for expression in self.expressions:
                if expression.interpret(line, line_number, context):
                    handled = True
                    break

            if not handled:
                raise PumlParseException("Unsupported PUML syntax", line_number, line)

        self._validate_document(context)
        return {"classes": context.classes, "edges": context.edges}

    def _remove_comments(self, line: str, in_block_comment: bool) -> tuple[str, bool]:
        """
        Remove comments from a line, handling three types of PUML comments:
        1. Line comments: ' single quote
        2. Block comments: /' ... '/
        3. Inline block comments: /' comment '/ code

        Returns: (cleaned_line, in_block_comment_state)
        """
        result = ""
        i = 0

        while i < len(line):
            # Check if we're exiting a block comment
            if in_block_comment:
                if i < len(line) - 1 and line[i] == "'" and line[i + 1] == "/":
                    in_block_comment = False
                    i += 2
                    continue
                i += 1
                continue

            # Check if we're entering a block comment
            if i < len(line) - 1 and line[i] == "/" and line[i + 1] == "'":
                in_block_comment = True
                i += 2
                continue

            # Check if this is a line comment
            if line[i] == "'":
                break

            result += line[i]
            i += 1

        return result, in_block_comment

    def _is_ignorable(self, line: str) -> bool:
        return not line or line.startswith("//") or line.startswith("title")

    def _validate_document(self, context: InterpreterContext):
        if not context.start_found:
            raise PumlParseException("Missing @startuml directive")

        if not context.end_found:
            raise PumlParseException("Missing @enduml directive")

        if context.in_class_body:
            raise PumlParseException("Unclosed class body")

    def _extract_class_name(self, keyword: str, line: str) -> str:
        """Extract class name from a class declaration line."""
        if not line.startswith(keyword):
            return ""
        suffix = line[len(keyword):].strip()
        if not suffix:
            return ""
        name = suffix.split(" ")[0].strip()
        if name:
            return name
        return ""

    def _extract_edge_info(self, parts: list[str]) -> dict:
        """Extract source and target from a relation declaration."""
        if len(parts) == 2:
            source = self._normalize_edge_endpoint(parts[0])
            target = self._normalize_edge_endpoint(parts[1], strip_label=True)
            if source and target:
                return {"source": source, "target": target}
        return {}

    def _normalize_edge_endpoint(self, endpoint: str, strip_label: bool = False) -> str:
        # Remove trailing edge label like " : arcs4" without touching namespace separators "::".
        cleaned = endpoint
        if strip_label:
            cleaned = re.split(r"\s+:\s+", cleaned, maxsplit=1)[0]

        # Multiplicities are usually quoted; strip them before resolving class token.
        cleaned = re.sub(r'"[^"]*"', "", cleaned).strip()
        if not cleaned:
            return ""

        # Endpoints are expected to be a single class token after cleanup.
        return cleaned.split()[0].strip()

    def _parse_class_member(self, line: str) -> dict | None:
        """Parse a class member (attribute or method) with visibility modifier."""
        line = line.strip()
        if not line or line.startswith("//") or line.startswith("'"):
            return None

        visibility_map = {"+": "public", "-": "private", "#": "protected", "~": "package"}
        visibility = "public"

        if line and line[0] in visibility_map:
            visibility = visibility_map[line[0]]
            line = line[1:].strip()

        if "(" in line and ")" in line:
            method_match = re.match(r'([a-zA-Z_]\w*)\s*\((.*?)\)', line)
            if method_match:
                method_name = method_match.group(1)
                params = method_match.group(2).strip()
                signature = f"{method_name}({params})"
                return {
                    "type": "method",
                    "name": method_name,
                    "visibility": visibility,
                    "signature": signature
                }
        else:
            attr_match = re.match(r'([a-zA-Z_]\w*)\s*(?::\s*(.+))?', line)
            if attr_match:
                attr_name = attr_match.group(1)
                datatype = attr_match.group(2).strip() if attr_match.group(2) else ""
                return {
                    "type": "attribute",
                    "name": attr_name,
                    "visibility": visibility,
                    "datatype": datatype
                }

        return None

