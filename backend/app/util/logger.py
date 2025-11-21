from app.config import settings
import os
import logging
from logging.handlers import RotatingFileHandler

log_dir = os.path.join(os.getcwd(), "logs")
os.makedirs(log_dir, exist_ok=True)

_logger = logging.getLogger("fastapi_logger")

if settings.log_level.upper() == "NONE":
    _logger.disabled = True
else:
    _logger.setLevel(getattr(logging, settings.log_level.upper(), logging.INFO))

_handler = RotatingFileHandler(
    os.path.join(log_dir, "app.log"), maxBytes=5 * 1024 * 1024, backupCount=2
)
_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
_handler.setFormatter(_formatter)
_logger.addHandler(_handler)


def log(message, level="info"):
    level = level.lower()
    if level == "debug":
        _logger.debug(message)
    elif level == "warning":
        _logger.warning(message)
    elif level == "error":
        _logger.error(message)
    elif level == "critical":
        _logger.critical(message)
    else:
        _logger.info(message)
