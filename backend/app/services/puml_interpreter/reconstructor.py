import re


class PumlReconstructor:
    def __init__(self, relations: dict[str, str]):
        self.relations = sorted(relations.items(), key=lambda item: len(item[0]), reverse=True)
        self.class_keywords = sorted(
            {
                "abstract",
                "abstract class",
                "annotation",
                "class",
                "dataclass",
                "entity",
                "enum",
                "exception",
                "interface",
                "metaclass",
                "protocol",
                "record",
                "stereotype",
                "struct",
            },
            key=len,
            reverse=True,
        )

    def reconstruct(self, data: dict, original_lines: list[str]) -> str:
        allowed_classes = set(data.get("classes", {}).keys())
        allowed_edges = {
            (edge.get("source"), edge.get("target"), edge.get("relation"))
            for edge in data.get("edges", [])
        }

        output_lines: list[str] = []
        in_block_comment = False
        skip_class_body = False
        brace_depth = 0

        for line in original_lines:
            cleaned_line, in_block_comment = self._remove_comments(line, in_block_comment)

            if skip_class_body:
                brace_depth += cleaned_line.count("{") - cleaned_line.count("}")
                if brace_depth <= 0:
                    skip_class_body = False
                continue

            if not cleaned_line.strip():
                output_lines.append(line)
                continue

            class_info = self._extract_class_declaration(cleaned_line)
            if class_info is not None:
                class_name, has_body = class_info
                if class_name not in allowed_classes:
                    if has_body:
                        brace_depth = cleaned_line.count("{") - cleaned_line.count("}")
                        skip_class_body = brace_depth > 0
                    continue
                output_lines.append(line)
                continue

            edge_info = self._extract_edge_info(cleaned_line)
            if edge_info is not None:
                if edge_info in allowed_edges:
                    output_lines.append(line)
                continue

            output_lines.append(line)

        return "\n".join(output_lines)

    def _extract_class_declaration(self, line: str) -> tuple[str, bool] | None:
        candidate = line.lstrip()

        for keyword in self.class_keywords:
            if not candidate.startswith(keyword):
                continue

            if len(candidate) > len(keyword) and not candidate[len(keyword)].isspace():
                continue

            suffix = candidate[len(keyword):]
            name_match = re.match(r"\s+([^\s{]+)", suffix)
            if not name_match:
                return None

            class_name = name_match.group(1)

            return class_name, "{" in suffix

        return None

    def _extract_edge_info(self, line: str) -> tuple[str, str, str] | None:
        line_without_brackets = re.sub(r"\[.*?\]", "", line)

        for relation_symbol, relation_name in self.relations:
            if relation_symbol not in line_without_brackets:
                continue

            parts = line_without_brackets.split(relation_symbol)
            if len(parts) != 2:
                continue

            source = self._normalize_edge_endpoint(parts[0])
            target = self._normalize_edge_endpoint(parts[1], strip_label=True)
            if source and target:
                return source, target, relation_name

        return None

    def _normalize_edge_endpoint(self, endpoint: str, strip_label: bool = False) -> str:
        cleaned = endpoint
        if strip_label:
            cleaned = re.split(r"\s+:\s+", cleaned, maxsplit=1)[0]

        cleaned = re.sub(r'"[^"]*"', "", cleaned).strip()
        if not cleaned:
            return ""

        return cleaned.split()[0].strip()

    def _remove_comments(self, line: str, in_block_comment: bool) -> tuple[str, bool]:
        result = ""
        i = 0

        while i < len(line):
            if in_block_comment:
                if i < len(line) - 1 and line[i] == "'" and line[i + 1] == "/":
                    in_block_comment = False
                    i += 2
                    continue
                i += 1
                continue

            if i < len(line) - 1 and line[i] == "/" and line[i + 1] == "'":
                in_block_comment = True
                i += 2
                continue

            if line[i] == "'":
                break

            result += line[i]
            i += 1

        return result, in_block_comment

