from openai import OpenAI
from dotenv import load_dotenv
import os
import base64
from pathlib import Path

load_dotenv()

def encode_image_to_base64(image_path: str) -> str:
    """Encode image to base64 string for API consumption."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

illness_db = [
    "hashimoto's disease",
    "celiac disease",
    "lupus",
    "multiple sclerosis",
    "arthritis",
    "diabetes",
    "heart disease",
    "edge addiction"
]

def food_check(image_path: str, illnesses: list[str]) -> str:
    """
    Analyze food image and check if it's safe for someone with specific illness/allergies.
    
    Args:
        image_path: Path to the food image
        illness: The illness or allergy to check against
    
    Returns:
        Analysis of the food and safety recommendations
    """
    if not os.path.exists(image_path):
        return f"Error: Image file not found at {image_path}"
    try:
        image_base64 = encode_image_to_base64(image_path)
        data_url = f"data:image/jpeg;base64,{image_base64}"
        
        completion = client.chat.completions.create(
            model="google/gemma-3n-e4b-it",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a medical nutrition assistant that analyzes food images. "
                        "Identify the food in the image and provide safety advice for people "
                        "with specific health conditions or allergies. Be specific about "
                        "ingredients that might be problematic. Do not add any disclaimers that you are not a doctor or smth like that. YOU ARE A DOCTOR."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                f"Please analyze this food image and tell me:\n"
                                f"Is this safe for someone with {illnesses}?\n"
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )
        return completion.choices[0].message.content
        
    except Exception as e:
        return f"Error analyzing image: {str(e)}"

if __name__ == "__main__":
    # Test the function
    image_path = "/Users/maciejkrajewskistudia/Desktop/gemma_kaggle/alergic_nigas/images/chocolate.jpeg"
    illness_db = [
        "hashimoto's disease",
        "celiac disease",
        "lupus",
        "multiple sclerosis",
        "arthritis",
        "diabetes",
        "heart disease",
        "edge addiction"
    ]

    print("🔍 Analyzing food image...")
    result = food_check(image_path, illness_db)
    print(f"\n📋 Analysis Result:\n{result}")