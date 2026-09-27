import os

# Geographic bounds for NE India (approximate)
NE_INDIA_BOUNDS = {
    'min_lat': 21.5,
    'max_lat': 29.5,
    'min_lng': 88.0,
    'max_lng': 97.5
}

# Grid resolution in degrees
GRID_RESOLUTION = 0.05

# Feature lists
TERRAIN_FEATURES = [
    'elevation',
    'slope',
    'aspect',
    'curvature',
    'twi',
    'ndvi',
    'land_cover',
    'lithology',
    'distance_to_fault',
    'distance_to_road',
    'soil_type',
    'drainage_density'
]

RAINFALL_FEATURES = [
    'rainfall_current',
    'rainfall_3day',
    'rainfall_7day',
    'rainfall_14day',
    'rainfall_intensity',
    'soil_moisture_proxy'
]

# Random state for reproducibility
RANDOM_STATE = 42

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'saved_models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Ensure directories exist
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
