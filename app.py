from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
model = load_model('cat_classifier.h5')  # Carga el modelo entrenado

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image = Image.open(io.BytesIO(file.read()))
    image = image.resize((224, 224))  # Ajusta el tamaño según tu modelo
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    prediction = model.predict(image)
    class_id = np.argmax(prediction)
    return jsonify({'class_id': int(class_id)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)