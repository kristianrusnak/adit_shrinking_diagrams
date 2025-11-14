class Graph:
    def __init__(self, PUML):
        self.PUML = PUML
        self.size = len(PUML["classes"])
        self.edges = []  # For storing edges as (weight, u, v)
        self.vertex_data = [''] * self.size  # Store vertex names

        self.extract_puml_data(PUML)
    
    def extract_puml_data(self, PUML):
        for class_name, index in PUML["classes"].items():
            self.add_vertex_data(int(index), class_name)
        
        for edge in PUML["edges"]:

            source = edge["source"]
            target = edge["target"]
            weight = int(edge["weight"])

            if source in PUML["classes"] and target in PUML["classes"]:
                u = int(PUML["classes"][source])
                v = int(PUML["classes"][target])
                self.add_edge(u, v, weight)

    def add_edge(self, u, v, weight):
        if 0 <= u < self.size and 0 <= v < self.size:
            self.edges.append((u, v, weight))  # Add edge with weight
            
    def add_vertex_data(self, vertex, data):
        if 0 <= vertex < self.size:
            self.vertex_data[vertex] = data

    def find(self, parent, i):
        if parent[i] == i:
            return i
        return self.find(parent, parent[i])

    def union(self, parent, rank, x, y):
        xroot = self.find(parent, x)
        yroot = self.find(parent, y)
        if rank[xroot] < rank[yroot]:
            parent[xroot] = yroot
        elif rank[xroot] > rank[yroot]:
            parent[yroot] = xroot
        else:
            parent[yroot] = xroot
            rank[xroot] += 1

    def kruskals_algorithm(self):
        result = []  # MST
        i = 0  # edge counter

        self.edges = sorted(self.edges, key=lambda item: item[2])

        parent, rank = [], []

        for node in range(self.size):
            parent.append(node)
            rank.append(0)

        while i < len(self.edges):
            u, v, weight = self.edges[i]
            i += 1
            
            x = self.find(parent, u)
            y = self.find(parent, v)
            if x != y:
                result.append((u, v, weight))
                self.union(parent, rank, x, y)

        return result

    def extract_solution(self, sol):
        edges = []

        for u, v, weight in sol:
            edges.append({
                "source": self.vertex_data[u],
                "target": self.vertex_data[v],
                "weight": weight
            })

        return {"classes": self.PUML["classes"], "edges": edges}