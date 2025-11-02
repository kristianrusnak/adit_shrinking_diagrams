from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str  # required

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent / ".env"
    )


settings = Settings()
