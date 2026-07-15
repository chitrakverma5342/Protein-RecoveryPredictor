from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

linear_model = joblib.load('linear_model.pkl')
dt_model = joblib.load('dt_model.pkl')
lr_model = joblib.load('lr_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():

    data = request.json
    hours = data['hours']
    intensity = data['intensity']
    core = data['core']

    features = [[hours, intensity, core]]

    protein = linear_model.predict(features)[0]

    dt_prediction = dt_model.predict(features)[0]

    lr_prediction = lr_model.predict(features)[0]

    return jsonify({
        'protein': round(float(protein), 1),
        'decision_tree': dt_prediction,
        'logistic_regression': lr_prediction
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)