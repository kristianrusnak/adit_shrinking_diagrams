from collections.abc import Callable

ClassNameExtractor = Callable[[str, str], str]
ClassMemberParser = Callable[[str], dict | None]
EdgeExtractor = Callable[[list[str]], dict]

