from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows requests from your frontend (localhost in dev)

# Load the trained model (make sure this is in the same directory or specify the correct path)
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Extract features from the JSON payload
    features = np.array([
        data['avg_arrival'],
        data['avg_burst'],
        data['avg_priority'],
        data['std_burst'],
        data['num_processes']
    ]).reshape(1, -1)

    # Predict using the trained model
    prediction_encoded = model.predict(features)[0]

    # Replace this label list with the one from your label encoder
    label_list = ['FCFS', 'SJF', 'SRTF']  # Adjust according to your model
    prediction = label_list[prediction_encoded]

    return jsonify({'recommended_algorithm': prediction})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
