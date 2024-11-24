import csv
from google.cloud import firestore

# Initialize Firestore db
db = firestore.Client.from_service_account_json("json/spiral-eaea4-3ea218f49f07.json")

def fetch_and_write_to_csv():
    try:
        # Fetch all documents from the SurveyResponses collection
        docs = db.collection('SurveyResponses').stream()

        # Open CSV file for writing
        with open('survey_responses.csv', 'w', newline='') as csvfile:
            # Define headers for the CSV
            fieldnames = [
                'user_id', 'audio_no', 
                'label_pair_1', 'response1', 
                'label_pair_2', 'response2', 
                'label_pair_3', 'response3', 
                'label_pair_4', 'response4', 
                'label_pair_5', 'response5'
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            # Loop through each document in the collection
            for doc in docs:
                user_id = doc.id  # Document name (Prolific ID or "anonymous")
                data = doc.to_dict()

                # Loop through each audio file in the document
                for audio_no, audio_data in data.items():
                    # Prepare a row with up to 5 label/response pairs
                    row = {'user_id': user_id, 'audio_no': audio_no}
                    for i, (label_pair, response) in enumerate(audio_data.items()):
                        row[f'label_pair_{i+1}'] = label_pair
                        row[f'response{i+1}'] = response

                    # Write the row to the CSV
                    writer.writerow(row)

        print("Data successfully written to survey_responses.csv")
    except Exception as e:
        print(f"Error: {e}")

# Run the function
if __name__ == "__main__":
    fetch_and_write_to_csv()
