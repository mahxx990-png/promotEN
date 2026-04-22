from flask import Flask, request, send_from_directory, jsonify
from google import genai  # cspell:ignore genai
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@app.route("/api/convert", methods=["POST"])
def convert_text():
    try:
        data = request.get_json() or {}
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        conversion_prompt = f"""You are an expert prompt engineer. Given the following user text, create the BEST possible prompt that would achieve what the user wants.

User text: "{text}"

Create a single, highly effective prompt that:
1. Is clear and specific
2. Provides proper context
3. Uses best prompt engineering practices
4. Is optimized for the task described
5. Includes necessary details and constraints

Format the response as clean HTML with proper styling. Use <strong> for emphasis, <em> for important terms, and <br> for line breaks to make it readable. Return ONLY the formatted HTML prompt, nothing else. Make it the absolute best prompt possible for this task."""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=conversion_prompt
        )
        result = response.text
        return jsonify({"result": result})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    full_path = os.path.join(BASE_DIR, path)
    if os.path.exists(full_path):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

