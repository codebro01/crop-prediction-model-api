# server.py
from flask import Flask, request, jsonify
from waitress import serve
import joblib

app = Flask(__name__)
model = joblib.load('./model.joblib')
print("🔍 Model loaded:", model)
print("📦 Model type:", type(model))
print('wetin dey sup')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # assumes JSON with the input features
    prediction = model.predict([data['features']])
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    serve(app, host="0.0.0.0", port=5000)
    # app.run(port=5000)
