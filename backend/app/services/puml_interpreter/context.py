from dataclasses import dataclass, field


@dataclass
class InterpreterContext:
    classes: dict = field(default_factory=dict)
    edges: list = field(default_factory=list)
    current_class: str | None = None
    in_class_body: bool = False
    class_count: int = 0
    start_found: bool = False
    end_found: bool = False

    def add_class(self, class_name: str, in_class_body: bool):
        self.classes[class_name] = {"id": self.class_count, "attributes": [], "methods": []}
        self.class_count += 1
        self.current_class = class_name
        self.in_class_body = in_class_body

    def close_class(self):
        self.current_class = None
        self.in_class_body = False

    def add_member(self, member: dict):
        if not self.current_class:
            return

        if member["type"] == "attribute":
            self.classes[self.current_class]["attributes"].append(
                {
                    "name": member["name"],
                    "visibility": member["visibility"],
                    "datatype": member.get("datatype", ""),
                }
            )
            return

        if member["type"] == "method":
            self.classes[self.current_class]["methods"].append(
                {
                    "name": member["name"],
                    "visibility": member["visibility"],
                    "signature": member["signature"],
                }
            )

