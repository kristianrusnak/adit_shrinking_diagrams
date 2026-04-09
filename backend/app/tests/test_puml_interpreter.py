from pathlib import Path

import pytest

from app.services.parse_puml_service import PUMLParser
from app.services.puml_interpreter import PumlParseException


def _build_parser() -> PUMLParser:
    config_path = Path(__file__).resolve().parents[1] / "services" / "parser_config.json"
    return PUMLParser(str(config_path))


def test_parse_file_with_interpreter_returns_class_and_edge_map(tmp_path):
    source = tmp_path / "diagram.puml"
    source.write_text(
        """@startuml
class User {
  +id: int
  +getName(): str
}
class Order
User -- Order
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert set(parsed["classes"].keys()) == {"User", "Order"}
    assert len(parsed["classes"]["User"]["attributes"]) == 1
    assert len(parsed["classes"]["User"]["methods"]) == 1
    assert parsed["edges"] == [{"source": "User", "target": "Order", "relation": "association"}]


def test_parse_file_raises_for_invalid_member_syntax(tmp_path):
    source = tmp_path / "diagram_invalid_member.puml"
    source.write_text(
        """@startuml
class User {
  ???
}
@enduml
"""
    )

    parser = _build_parser()

    with pytest.raises(PumlParseException, match="Invalid class member declaration"):
        parser.parse_file(str(source))


def test_parse_file_raises_for_missing_enduml(tmp_path):
    source = tmp_path / "diagram_missing_end.puml"
    source.write_text(
        """@startuml
class User
"""
    )

    parser = _build_parser()

    with pytest.raises(PumlParseException, match="Missing @enduml directive"):
        parser.parse_file(str(source))


def test_parse_file_handles_line_comments(tmp_path):
    source = tmp_path / "diagram_line_comments.puml"
    source.write_text(
        """@startuml
' This is a line comment
class User {
  +id: int ' attribute with inline comment
}
' Another comment
class Order
User -- Order ' relation comment
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert set(parsed["classes"].keys()) == {"User", "Order"}
    assert len(parsed["classes"]["User"]["attributes"]) == 1
    assert parsed["edges"] == [{"source": "User", "target": "Order", "relation": "association"}]


def test_parse_file_handles_block_comments(tmp_path):
    source = tmp_path / "diagram_block_comments.puml"
    source.write_text(
        """@startuml
/'
Block comment spanning
multiple lines
'/
class User {
  +id: int
}
class Order
User -- Order
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert set(parsed["classes"].keys()) == {"User", "Order"}


def test_parse_file_handles_inline_block_comments(tmp_path):
    source = tmp_path / "diagram_inline_block_comments.puml"
    source.write_text(
        """@startuml
class User {
  +id: int
}
/' Case 1 '/   class Order
/' Case 2 '/   User --> Order
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert set(parsed["classes"].keys()) == {"User", "Order"}
    assert parsed["edges"] == [{"source": "User", "target": "Order", "relation": "dependency-right"}]


def test_parse_file_handles_mixed_comments(tmp_path):
    source = tmp_path / "diagram_mixed_comments.puml"
    source.write_text(
        """@startuml
' Line comment at start
/'
Block comment
spanning lines
'/
class User {
  +id: int ' inline line comment
  +getName(): str
}
/' inline block '/ class Order
User -- Order ' relation with comment
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert set(parsed["classes"].keys()) == {"User", "Order"}
    assert len(parsed["classes"]["User"]["attributes"]) == 1
    assert len(parsed["classes"]["User"]["methods"]) == 1


def test_parse_file_ignores_title(tmp_path):
    source = tmp_path / "diagram_with_title.puml"
    source.write_text(
        """@startuml
title My Diagram Title
class User {
  +id: int
}
class Order
User -- Order
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert set(parsed["classes"].keys()) == {"User", "Order"}
    assert len(parsed["classes"]["User"]["attributes"]) == 1


def test_reparse_file_filters_and_preserves_source_order(tmp_path):
    source = tmp_path / "reparse_source.puml"
    output = tmp_path / "reparse_output.puml"
    source.write_text(
        """@startuml
class A {
  +id: int
  +name: str
  +ping(x)
  +pong()
}
class B
class C
A -- B
B --> C
A --> C
@enduml
"""
    )

    parser = _build_parser()
    new_data = {
        "classes": {
            "A": {
                "attributes": [{"name": "name", "visibility": "public"}],
                "methods": [{"signature": "pong()", "visibility": "public"}],
            },
            "C": {"attributes": [], "methods": []},
        },
        "edges": [
            {"source": "A", "target": "C", "relation": "dependency-right"},
        ],
    }

    parser.reparse_file(str(source), str(output), new_data)
    result = output.read_text()

    assert result == (
        "@startuml\n"
        "class A {\n"
        "  +id: int\n"
        "  +name: str\n"
        "  +ping(x)\n"
        "  +pong()\n"
        "}\n"
        "class C\n"
        "A --> C\n"
        "@enduml\n"
    )


def test_reparse_file_preserves_title_and_comments(tmp_path):
    source = tmp_path / "reparse_comments_source.puml"
    output = tmp_path / "reparse_comments_output.puml"
    source.write_text(
        """@startuml
title Banking Diagram
' top-level note
class A
class B
A -- B ' relation note
@enduml
"""
    )

    parser = _build_parser()
    parser.reparse_file(
        str(source),
        str(output),
        {
            "classes": {"A": {"attributes": [], "methods": []}},
            "edges": [],
        },
    )

    assert output.read_text() == (
        "@startuml\n"
        "title Banking Diagram\n"
        "' top-level note\n"
        "class A\n"
        "@enduml\n"
    )


def test_reparse_file_reconstructs_empty_filtered_diagram(tmp_path):
    source = tmp_path / "reparse_empty_source.puml"
    output = tmp_path / "reparse_empty_output.puml"
    source.write_text(
        """@startuml
class KeepMe
@enduml
"""
    )

    parser = _build_parser()
    parser.reparse_file(str(source), str(output), {"classes": {}, "edges": []})

    assert output.read_text() == "@startuml\n@enduml\n"


def test_parse_file_parses_namespaced_target_with_extension_left(tmp_path):
    source = tmp_path / "diagram_namespaced_extension.puml"
    source.write_text(
        """@startuml
class SrcArc
class jointPackage::PetriNet2PNML::SrcPlaceToTransition
SrcArc <|-- jointPackage::PetriNet2PNML::SrcPlaceToTransition
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert parsed["edges"] == [
        {
            "source": "SrcArc",
            "target": "jointPackage::PetriNet2PNML::SrcPlaceToTransition",
            "relation": "extension-left",
        }
    ]


def test_parse_file_parses_namespaced_relation_with_multiplicity_and_label(tmp_path):
    source = tmp_path / "diagram_namespaced_label.puml"
    source.write_text(
        """@startuml
class jointPackage::PetriNet2PNML::SrcArc
class jointPackage::PetriNet2PNML::SrcPetriNet
jointPackage::PetriNet2PNML::SrcArc "0..9999" <-- "1..1" jointPackage::PetriNet2PNML::SrcPetriNet : arcs4
@enduml
"""
    )

    parser = _build_parser()
    parsed = parser.parse_file(str(source))

    assert parsed["edges"] == [
        {
            "source": "jointPackage::PetriNet2PNML::SrcArc",
            "target": "jointPackage::PetriNet2PNML::SrcPetriNet",
            "relation": "dependency-left",
        }
    ]



