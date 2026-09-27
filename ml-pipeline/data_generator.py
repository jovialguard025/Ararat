import numpy as np
import pandas as pd
from config import NE_INDIA_BOUNDS, TERRAIN_FEATURES, RAINFALL_FEATURES, RANDOM_STATE

np.random.seed(RANDOM_STATE)

def generate_terrain_data(n_points=5000):
    """
    Generates synthetic terrain data mimicking real satellite/terrain features.
    
    Args:
        n_points (int): Number of data points to generate.
        
    Returns:
        pd.DataFrame: DataFrame containing terrain features.
    """
    lat = np.random.uniform(NE_INDIA_BOUNDS['min_lat'], NE_INDIA_BOUNDS['max_lat'], n_points)
    lng = np.random.uniform(NE_INDIA_BOUNDS['min_lng'], NE_INDIA_BOUNDS['max_lng'], n_points)
    
    # Introduce correlation with latitude for realism (e.g., higher elevation in north)
    lat_factor = (lat - NE_INDIA_BOUNDS['min_lat']) / (NE_INDIA_BOUNDS['max_lat'] - NE_INDIA_BOUNDS['min_lat'])
    
    elevation = np.clip(np.random.normal(1500 + lat_factor * 2000, 800), 200, 4500)
    slope = np.clip(np.random.normal(20 + lat_factor * 20, 10), 0, 60)
    aspect = np.random.uniform(0, 360, n_points)
    curvature = np.random.normal(0, 0.5, n_points)
    curvature = np.clip(curvature, -2, 2)
    twi = np.clip(np.random.normal(10, 3), 2, 20)
    
    # NDVI correlated with elevation (lower at very high elevation)
    ndvi_base = np.random.normal(0.6, 0.2, n_points)
    ndvi = np.clip(ndvi_base - (elevation > 3500) * 0.3, 0, 1)
    
    land_cover = np.random.choice([1, 2, 3, 4, 5], n_points)
    lithology = np.random.choice([1, 2, 3, 4, 5, 6, 7, 8], n_points)
    distance_to_fault = np.random.exponential(10, n_points)
    distance_to_fault = np.clip(distance_to_fault, 0, 50)
    distance_to_road = np.random.exponential(5, n_points)
    distance_to_road = np.clip(distance_to_road, 0, 30)
    soil_type = np.random.choice([1, 2, 3, 4, 5, 6], n_points)
    drainage_density = np.clip(np.random.normal(2.5, 1), 0, 5)
    
    df = pd.DataFrame({
        'latitude': lat,
        'longitude': lng,
        'elevation': elevation,
        'slope': slope,
        'aspect': aspect,
        'curvature': curvature,
        'twi': twi,
        'ndvi': ndvi,
        'land_cover': land_cover,
        'lithology': lithology,
        'distance_to_fault': distance_to_fault,
        'distance_to_road': distance_to_road,
        'soil_type': soil_type,
        'drainage_density': drainage_density
    })
    return df

def generate_rainfall_data(n_points=5000):
    """
    Generates synthetic rainfall data.
    
    Args:
        n_points (int): Number of data points to generate.
        
    Returns:
        pd.DataFrame: DataFrame containing rainfall features.
    """
    lat = np.random.uniform(NE_INDIA_BOUNDS['min_lat'], NE_INDIA_BOUNDS['max_lat'], n_points)
    lng = np.random.uniform(NE_INDIA_BOUNDS['min_lng'], NE_INDIA_BOUNDS['max_lng'], n_points)
    
    rainfall_current = np.clip(np.random.exponential(30, n_points), 0, 200)
    rainfall_3day = np.clip(rainfall_current + np.random.exponential(50, n_points), 0, 400)
    rainfall_7day = np.clip(rainfall_3day + np.random.exponential(100, n_points), 0, 600)
    rainfall_14day = np.clip(rainfall_7day + np.random.exponential(150, n_points), 0, 1000)
    rainfall_intensity = np.clip(rainfall_current / 24 + np.random.normal(5, 2, n_points), 0, 50)
    soil_moisture_proxy = np.clip(np.random.normal(0.5, 0.2, n_points) + (rainfall_7day / 600) * 0.3, 0, 1)
    
    df = pd.DataFrame({
        'latitude': lat,
        'longitude': lng,
        'rainfall_current': rainfall_current,
        'rainfall_3day': rainfall_3day,
        'rainfall_7day': rainfall_7day,
        'rainfall_14day': rainfall_14day,
        'rainfall_intensity': rainfall_intensity,
        'soil_moisture_proxy': soil_moisture_proxy
    })
    return df

def generate_landslide_labels(terrain_df, rainfall_df):
    """
    Generates landslide labels based on a hidden risk rule with added noise.
    
    Args:
        terrain_df (pd.DataFrame): Terrain features DataFrame.
        rainfall_df (pd.DataFrame): Rainfall features DataFrame.
        
    Returns:
        pd.Series: Binary landslide labels (1/0).
    """
    n_points = len(terrain_df)
    
    # Hidden rule: high probability when (slope>30 AND rainfall_7day>300) OR 
    # (elevation>2000 AND soil_moisture>0.7 AND rainfall_current>100)
    rule1 = (terrain_df['slope'] > 30) & (rainfall_df['rainfall_7day'] > 300)
    rule2 = (terrain_df['elevation'] > 2000) & (rainfall_df['soil_moisture_proxy'] > 0.7) & (rainfall_df['rainfall_current'] > 100)
    
    base_prob = np.where(rule1 | rule2, 0.8, 0.05)
    
    # Add some noise based on other factors
    noise = (terrain_df['distance_to_fault'] < 5) * 0.1 + (terrain_df['ndvi'] < 0.2) * 0.05
    probs = np.clip(base_prob + noise - np.random.uniform(0, 0.1, n_points), 0, 1)
    
    labels = np.random.binomial(1, probs)
    return pd.Series(labels, name='landslide')

def generate_full_dataset(n_points=5000):
    """
    Generates the full synthetic dataset containing terrain, rainfall and labels.
    
    Args:
        n_points (int): Number of points to generate.
        
    Returns:
        tuple: (X_terrain, X_rainfall, X_combined, y)
    """
    X_terrain_full = generate_terrain_data(n_points)
    X_rainfall_full = generate_rainfall_data(n_points)
    
    # Ensure they have matching coordinates for combination
    X_rainfall_full['latitude'] = X_terrain_full['latitude']
    X_rainfall_full['longitude'] = X_terrain_full['longitude']
    
    y = generate_landslide_labels(X_terrain_full, X_rainfall_full)
    
    X_terrain = X_terrain_full[TERRAIN_FEATURES]
    X_rainfall = X_rainfall_full[RAINFALL_FEATURES]
    
    X_combined = pd.concat([X_terrain_full[['latitude', 'longitude']], X_terrain, X_rainfall], axis=1)
    
    return X_terrain, X_rainfall, X_combined, y

if __name__ == "__main__":
    X_t, X_r, X_c, y = generate_full_dataset(1000)
    print(f"Generated {len(y)} samples.")
    print(f"Positive rate: {y.mean():.2f}")
