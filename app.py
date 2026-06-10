from flask import Flask, request, render_template, jsonify
import numpy as np
import joblib
from tensorflow.keras.models import load_model

app = Flask(__name__)
model = None
scaler = None


def load_artifacts():
    global model, scaler
    model = load_model("model.h5")
    scaler = joblib.load("scaler.pkl")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/result")
def result():
    return render_template("result.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.form if request.form else request.get_json()
    try:
        features = [float(data.get(k)) for k in [
            "Pregnancies",
            "Glucose",
            "BloodPressure",
            "SkinThickness",
            "Insulin",
            "BMI",
            "DiabetesPedigreeFunction",
            "Age",
        ]]
    except Exception as e:
        return jsonify({"error": "invalid input", "details": str(e)}), 400

    X = np.array([features])
    X_s = scaler.transform(X)
    pred = model.predict(X_s)[0][0]
    result = "diabetic" if pred > 0.5 else "not diabetic"
    return jsonify({"prediction": result, "probability": float(pred)})


if __name__ == "__main__":
    load_artifacts()
    app.run(debug=True, host='0.0.0.0' , port=51999)
