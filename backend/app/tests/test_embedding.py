from app.services.parse_puml_service import PUMLParser
from app.services.shrinking_algorithms.factory import get_algorithm
import os
from app.tests.embedding.graph_builder2 import *
from app.tests.embedding.embedding2 import *

# NOTE:
# right now we have 2 versions of methods in genetic alg
# If we are serious about comparing the two we could refactor into strategies


def main():
    print(os.getcwd())
    config = "app/services/parser_config.json"
    parser = PUMLParser(config)

    filepath = "app/tests/test_file.puml"
    parsed = parser.parse_file(filepath)

    # print(parsed)
    # print(parsed["classes"]["User"])
    # print(parsed["edges"])

    G, stats_G = uml_dict_to_graph(parsed)
    emb, model = embed_graph(G)
    print(emb)

    alg = get_algorithm("genetic", preprocess=True)
    alg.initialize(
        population_size=50,
        generations=100,
    )

    reduced = alg.compute2(parsed)
    print(reduced)

    parser.reparse_file(filepath, "app/tests/reparsed.puml", reduced)


if __name__ == "__main__":
    main()
