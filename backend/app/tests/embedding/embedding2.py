import networkx as nx
import numpy as np
from node2vec import Node2Vec
from gensim.models import Word2Vec
from app.tests.embedding.graph_builder2 import *


def embed_graph(G: nx.Graph, dimensions=64, walk_length=30, num_walks=100):
    """
    Generates graph embeddings using the Node2Vec algorithm.

    This function takes a graph as input and computes an embedding representation
    for its nodes. It trains a Node2Vec model given specified parameters
    and returns the averaged embedding that summarizes the graph.

    :param G: The input graph as a NetworkX graph object.
    :param dimensions: The number of dimensions for the embeddings.
    :param walk_length: The length of each random walk performed during training.
    :param num_walks: The number of random walks per node.
    :return: A numpy array representing the averaged embedding of the graph nodes and the corresponding model.
    """
    # train node2vec
    n2v = Node2Vec(
        G,
        dimensions=dimensions,
        walk_length=walk_length,
        num_walks=num_walks,
        workers=4,
        quiet=True,
    )
    model = n2v.fit(window=10, min_count=1)

    # create embedding matrix
    node_list = list(G.nodes())
    emb = np.vstack([model.wv[str(n)] for n in node_list])
    return np.mean(emb, axis=0), model


def find_embedding(model: Word2Vec, G: nx.Graph):
    node_list = list(G.nodes())
    emb = np.vstack([model.wv[str(n)] for n in node_list])
    return np.mean(emb, axis=0)
