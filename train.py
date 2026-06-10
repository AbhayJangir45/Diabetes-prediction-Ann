import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense


def main():
    df = pd.read_csv("diabetes.csv")
    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = Sequential()
    model.add(Dense(8, activation="relu", input_dim=8))
    model.add(Dense(16, activation="relu"))
    model.add(Dense(8, activation="relu"))
    model.add(Dense(1, activation="sigmoid"))

    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    model.fit(X_train_s, y_train, epochs=50, batch_size=16, validation_split=0.1)

    loss, acc = model.evaluate(X_test_s, y_test, verbose=0)
    print(f"Test loss: {loss:.4f} - Test accuracy: {acc:.4f}")

    model.save("model.h5")
    joblib.dump(scaler, "scaler.pkl")
    print("Saved artifacts: model.h5, scaler.pkl")


if __name__ == "__main__":
    main()

print("Training complete.") 