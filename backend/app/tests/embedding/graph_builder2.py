import networkx as nx
import numpy as np
import json


WEIGHTS_FILE = "app/tests/embedding/weights.json"

with open(WEIGHTS_FILE, "r") as f:
    WEIGHTS = json.load(f)


def uml_dict_to_graph(uml: dict) -> tuple[nx.DiGraph, dict]:

    class_class_edges = 0
    class_attr_edges = 0
    class_method_edges = 0

    G = nx.DiGraph()
    classes = list(uml.get("classes", {}).keys())

    connector_enabled = WEIGHTS["weights"]["connector"]["enabled"]
    if connector_enabled:
        connector = "__node_connector__"
        c_w = WEIGHTS["weights"]["connector"]["weight"]
        G.add_node(connector)

    for cls_name in classes:
        # print(uml["classes"][cls_name])
        G.add_node(cls_name)

        if connector_enabled:
            G.add_edge(connector, cls_name, weight=c_w)
            G.add_edge(
                cls_name, connector, weight=c_w * 0.5
            )  # make sure walks do not pick connector often

        for attr in uml["classes"][cls_name].get("attributes", []):
            attr_uuid = f"{cls_name}::attr::{attr['name']}"
            # print(attr_uuid)
            G.add_node(attr_uuid)
            w1 = WEIGHTS["weights"]["attribute_edges"]["class_to_attribute"]
            G.add_edge(cls_name, attr_uuid, weight=w1)
            w2 = WEIGHTS["weights"]["attribute_edges"]["attribute_to_class"]
            G.add_edge(attr_uuid, cls_name, weight=w2)

            class_attr_edges += 1

        for method in uml["classes"][cls_name].get("methods", []):
            method_uuid = f"{cls_name}::method::{method['name']}::{method['signature']}"
            # print(method_uuid)
            G.add_node(method_uuid)
            w1 = WEIGHTS["weights"]["method_edges"]["class_to_method"]
            G.add_edge(cls_name, method_uuid, weight=w1)
            w2 = WEIGHTS["weights"]["method_edges"]["method_to_class"]
            G.add_edge(method_uuid, cls_name, weight=w2)

            class_method_edges += 1

        # print()

    for edge in uml.get("edges", []):
        src = edge["source"]
        dst = edge["target"]
        rel = edge["relation"]

        if src not in G or dst not in G:
            continue

        class_class_edges += 1

        if "-" in rel:
            rel, direction = rel.split("-")
            if direction == "right":
                w1 = WEIGHTS["weights"]["class_edges"][rel]["forward"]
                G.add_edge(src, dst, weight=w1)
                w2 = WEIGHTS["weights"]["class_edges"][rel]["reverse"]
                G.add_edge(dst, src, weight=w2)
            else:
                w1 = WEIGHTS["weights"]["class_edges"][rel]["forward"]
                G.add_edge(dst, src, weight=w1)
                w2 = WEIGHTS["weights"]["class_edges"][rel]["reverse"]
                G.add_edge(src, dst, weight=w2)
        else:
            w = WEIGHTS["weights"]["class_edges"][rel]["forward"]
            G.add_edge(src, dst, weight=w)
            G.add_edge(dst, src, weight=w)

    stats = {
        "total_edges": class_class_edges + class_attr_edges + class_method_edges,
        "class_class_edges": class_class_edges,
        "class_attr_edges": class_attr_edges,
        "class_method_edges": class_method_edges,
    }

    return G, stats
