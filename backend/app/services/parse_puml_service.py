
import json

class PUMLParser:
    
    def __init__(self, config_path ="parser_config.json"):
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
            with open(config_path, 'r') as file:
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
    

    def parse_file(self, filepath) -> json:

        with open(filepath, 'r') as file:
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