class PumlReconstructor:
    def __init__(self, relations: dict[str, str]):
        self.relation_symbols = self._build_relation_symbols(relations)

    def reconstruct(self, data: dict) -> str:
        lines = ["@startuml"]

        for class_name, class_info in data.get("classes", {}).items():
            attributes = class_info.get("attributes", [])
            methods = class_info.get("methods", [])

            if attributes or methods:
                lines.append(f"class {class_name} {{")
                for attribute in attributes:
                    lines.append(self._format_attribute(attribute))
                for method in methods:
                    lines.append(self._format_method(method))
                lines.append("}")
            else:
                lines.append(f"class {class_name}")

        for edge in data.get("edges", []):
            relation = edge.get("relation", "association")
            symbol = self.relation_symbols.get(relation, "--")
            source = edge.get("source", "")
            target = edge.get("target", "")
            lines.append(f"{source} {symbol} {target}")

        lines.append("@enduml")
        return "\n".join(lines) + "\n"

    def _build_relation_symbols(self, relations: dict[str, str]) -> dict[str, str]:
        symbols_by_relation = {}
        for symbol, relation in relations.items():
            symbols_by_relation.setdefault(relation, symbol.strip())
        return symbols_by_relation

    def _format_attribute(self, attribute: dict) -> str:
        visibility = self._visibility_symbol(attribute.get("visibility", "public"))
        name = attribute.get("name", "")
        datatype = attribute.get("datatype", "")
        if datatype:
            return f"  {visibility}{name}: {datatype}"
        return f"  {visibility}{name}"

    def _format_method(self, method: dict) -> str:
        visibility = self._visibility_symbol(method.get("visibility", "public"))
        signature = method.get("signature", "")
        return f"  {visibility}{signature}"

    def _visibility_symbol(self, visibility: str) -> str:
        symbols = {
            "public": "+",
            "private": "-",
            "protected": "#",
            "package": "~",
        }
        return symbols.get(visibility, "+")

