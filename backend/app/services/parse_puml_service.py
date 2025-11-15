import json
from kruskals_algorithm import Graph


class PUMLParser:
    def __init__(self, config_path):
        self.weights = {}
        self.class_names = set()
        self.parse_config(config_path)

        if not self.weights:
            print("No weights loaded, using default settings.")
            return

    def parse_config(self, config_path):
        if config_path is None:
            print("No config path provided, loading default config.")
            return {}

        try:
            with open(config_path, "r") as file:
                config = json.load(file)
                self.weights = config.get("weights", {})
                self.class_names = set(config.get("class_names", []))
                return config

        except Exception as e:
            print(f"Error reading config file: {e}")
            return {}

    def check_correct_puml(self, file) -> bool:
        start_found = False
        end_found = False

        for line in file:
            line = line.strip()
            if line == "@startuml":
                start_found = True
            elif line == "@enduml":
                end_found = True

        return start_found and end_found

    def parse_file(self, filepath) -> dict | list:

        with open(filepath, "r") as file:
            if not self.check_correct_puml(file):
                print("File is not a correct PUML file.")
                return []

            file.seek(0)

            classes = {}
            classesCount = 0
            edges = []

            for line in file:
                line = line.strip()

                for keyword in self.class_names:
                    if line.startswith(keyword):
                        class_info = self.extract_class_name(keyword, line)
                        if class_info:
                            classes[class_info] = classesCount
                            classesCount += 1
                        break

                for weight_key, weight_value in self.weights.items():
                    if weight_key in line:
                        parts = line.split(weight_key)
                        edge = self.extract_edge_info(parts)
                        edges.append(edge | {"weight": weight_value})
                        break

            return {"classes": classes, "edges": edges}

    def extract_class_name(self, keyword, line):
        name = line.replace(keyword + " ", "").split(" ")[0].strip()
        if name:
            return name
        return ""

    def extract_edge_info(self, parts) -> dict:
        if len(parts) == 2:
            source = parts[0].strip()
            target = parts[1].strip()

            if '"' in source:
                source = source.split('"')[0].strip()

            if '"' in target:
                target = target.split('"')[-1].strip()

            return {"source": source, "target": target}
        return {}

    def reparse_file(self, source_path, output_path, new_data):

        if source_path is None or output_path is None:
            print("Source or output path is None.")
            return

        if not new_data:
            print("No new data provided for reparsing.")
            return

        lines = []

        with open(source_path, "r") as file:
            line = file.readline()
            while line:

                appendLine = True

                for weight_key, weight_value in self.weights.items():
                    if weight_key in line.strip():
                        parts = line.split(weight_key)
                        edge = self.extract_edge_info(parts)
                        if edge | {"weight": weight_value} not in new_data["edges"]:
                            appendLine = False
                            break
                        break

                if appendLine:
                    lines.append(line)

                line = file.readline()

        with open(output_path, "w") as file:
            file.writelines(lines)


if __name__ == "__main__":
    parser = PUMLParser("parser_config.json")
    result = parser.parse_file("testing_file.puml")
    print(json.dumps(result, indent=4))

    graph = Graph(result)
    sol = graph.kruskals_algorithm()

    sol = graph.extract_solution(sol)
    print(json.dumps(sol, indent=4))

    parser.reparse_file("testing_file.puml", "output_file.puml", sol)
