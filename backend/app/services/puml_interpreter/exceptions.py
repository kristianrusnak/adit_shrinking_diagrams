class PumlParseException(Exception):
    def __init__(self, message: str, line_number: int | None = None, line: str | None = None):
        details = message
        if line_number is not None:
            details = f"Line {line_number}: {details}"
        if line is not None:
            details = f"{details}. Offending line: {line}"
        super().__init__(details)
        self.line_number = line_number
        self.line = line

