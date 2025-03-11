import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# Configuración
IMG_SIZE = (128, 128)  # Reducir el tamaño de las imágenes
BATCH_SIZE = 16         # Reducir el tamaño del lote
EPOCHS = 5              # Reducir el número de épocas
DATASET_DIR = './dataset'  # Ruta a la carpeta dataset

# Generadores de datos
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)
val_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# Construye el modelo (más simple)
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(64, activation='relu'),  # Menos neuronas
    Dense(train_generator.num_classes, activation='softmax')
])

# Compila el modelo
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Entrena el modelo
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS
)

# Guarda el modelo
model.save('cat_classifier.h5')
print("Modelo guardado como cat_classifier.h5")