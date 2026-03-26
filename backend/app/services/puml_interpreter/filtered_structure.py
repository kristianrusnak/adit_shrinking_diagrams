class FilteredStructureBuilder:
    def build(self, source_data: dict, new_data: dict) -> dict:
        target_classes = new_data.get("classes", {})
        target_edges = new_data.get("edges", [])

        filtered_classes = {}
        for class_name, class_info in source_data.get("classes", {}).items():
            if class_name not in target_classes:
                continue

            target_class = target_classes.get(class_name, {})
            filtered_classes[class_name] = {
                "id": class_info.get("id", 0),
                "attributes": self._filter_attributes(
                    class_info.get("attributes", []),
                    target_class.get("attributes", []),
                ),
                "methods": self._filter_methods(
                    class_info.get("methods", []),
                    target_class.get("methods", []),
                ),
            }

        allowed_edges = {
            (
                edge.get("source"),
                edge.get("target"),
                edge.get("relation"),
            )
            for edge in target_edges
        }

        filtered_edges = []
        for edge in source_data.get("edges", []):
            edge_key = (edge.get("source"), edge.get("target"), edge.get("relation"))
            if edge_key not in allowed_edges:
                continue
            if edge.get("source") not in filtered_classes:
                continue
            if edge.get("target") not in filtered_classes:
                continue
            filtered_edges.append(edge)

        return {"classes": filtered_classes, "edges": filtered_edges}

    def _filter_attributes(self, source_attributes: list, target_attributes: list) -> list:
        allowed = {
            (attr.get("name"), attr.get("visibility"))
            for attr in target_attributes
        }
        return [
            attr
            for attr in source_attributes
            if (attr.get("name"), attr.get("visibility")) in allowed
        ]

    def _filter_methods(self, source_methods: list, target_methods: list) -> list:
        allowed = {
            (method.get("signature"), method.get("visibility"))
            for method in target_methods
        }
        return [
            method
            for method in source_methods
            if (method.get("signature"), method.get("visibility")) in allowed
        ]

