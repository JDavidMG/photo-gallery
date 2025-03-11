import os
import shutil

# Ruta a la carpeta con las imágenes
IMAGES_DIR = 'images'  # Cambia esto
DATASET_DIR = 'dataset'  # Carpeta donde se organizarán las imágenes

# Crear la carpeta dataset si no existe
os.makedirs(DATASET_DIR, exist_ok=True)

# Recorre todas las imágenes en la carpeta
for filename in os.listdir(IMAGES_DIR):
    if filename.endswith('.jpg') or filename.endswith('.png'):  # Ajusta las extensiones si es necesario
        # Extrae el tipo de gato del nombre del archivo
        cat_type = filename.split('_')[0]

        # Crea una subcarpeta para el tipo de gato si no existe
        cat_dir = os.path.join(DATASET_DIR, cat_type)
        os.makedirs(cat_dir, exist_ok=True)

        # Mueve la imagen a la subcarpeta correspondiente
        shutil.move(
            os.path.join(IMAGES_DIR, filename),
            os.path.join(cat_dir, filename)
        )

print("Imágenes organizadas en subcarpetas.")