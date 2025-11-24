from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str  # required
    log_level: str = "INFO"
    refresh_token_expire_days: int = 7

    model_config = SettingsConfigDict(env_file=Path(__file__).parent.parent / ".env")


settings = Settings()
