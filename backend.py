from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import firestore

app = Flask(__name__)

# Allow requests only from the specified frontend
CORS(app, origins=["http://127.0.0.1:3000"])

# Initialize Firestore client with the service account key
db = firestore.Client.from_service_account_json("json/spiral-eaea4-3ea218f49f07.json")

@app.route('/store-slider-data', methods=['POST'])
def store_slider_data():
    data = request.json
    print("Received data:", data)

    user_id = data.get('user_id', '')  # Prolific ID
    audio_file = data.get('audio_file')  # Audio file name
    slider_labels = data.get('slider_labels')  # Labels in "label1/label2" format
    slider_values = data.get('slider_values')  # Responses (values)

    if not audio_file or not slider_labels or not slider_values:
        print("Missing fields. user_id:", user_id, "audio_file:", audio_file,
              "slider_labels:", slider_labels, "slider_values:", slider_values)
        return jsonify({"error": "Missing required fields."}), 400

    try:
        # Use "anonymous" as the default document ID if user_id is empty
        doc_id = user_id if user_id else "anonymous2"
        doc_ref = db.collection('SurveyResponses').document(doc_id)

        # Combine labels and responses into a single dictionary for the audio file
        audio_data = {label: value for label, value in zip(slider_labels, slider_values)}

        # Add/merge audio data under the audio file key
        doc_ref.set({f"audio_no_{audio_file}": audio_data}, merge=True)

        print(f"Data stored successfully for audio_file {audio_file}")
        return jsonify({"message": "Data stored successfully."}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
