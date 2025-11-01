from openai import OpenAI

from backend.app.config import settings


class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)

    def chat(self, messages: list[dict], model: str = "gpt-4o-mini") -> str:
        response = self.client.chat.completions.create(
            model=model,
            messages=messages
        )
        return response.choices[0].message.content
