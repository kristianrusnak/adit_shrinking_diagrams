from backend.app.services.openai_service import OpenAIService


def test_openai_chat():
    service = OpenAIService()

    messages = [
        {"role": "user", "content": "Ahoj! Ako sa mas?."}
    ]

    response = service.chat(messages)
    print("OpenAI Response:", response)

# Run the test directly
if __name__ == "__main__":
    test_openai_chat()
