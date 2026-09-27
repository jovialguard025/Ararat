import os
import argparse
import pandas as pd
import numpy as np

from config import MODEL_DIR, TERRAIN_FEATURES, RAINFALL_FEATURES
from models.stage1_susceptibility import TerrainSusceptibilityModel
from models.stage2_dynamic_risk import DynamicRiskModel
from models.xai_explainer import RiskExplainer

def get_risk_level(score):
    if score >= 0.75:
        return 'CRITICAL'
    elif score >= 0.5:
        return 'HIGH'
    elif score >= 0.25:
        return 'MEDIUM'
    return 'LOW'

def predict_risk(lat, lng, terrain_features, rainfall_features):
    """
    Runs the two-stage prediction pipeline and returns risk evaluation with XAI.
    """
    stage1 = TerrainSusceptibilityModel()
    stage1.load(os.path.join(MODEL_DIR, 'stage1_model.joblib'))
    
    stage2 = DynamicRiskModel()
    stage2.load(os.path.join(MODEL_DIR, 'stage2_model.joblib'))
    
    # Format inputs
    t_df = pd.DataFrame([terrain_features])
    r_df = pd.DataFrame([rainfall_features])
    
    # Stage 1
    susceptibility_score = stage1.predict_susceptibility(t_df)[0]
    
    # Stage 2
    r_df['susceptibility_score'] = susceptibility_score
    risk_score = stage2.predict_risk(r_df)[0]
    
    # Explainer
    feature_names = list(r_df.columns)
    explainer = RiskExplainer(stage2.model, feature_names)
    explanation = explainer.explain_single(r_df)
    advisory = explainer.generate_risk_advisory(risk_score, explanation)
    
    return {
        'risk_score': float(risk_score),
        'risk_level': get_risk_level(risk_score),
        'susceptibility_score': float(susceptibility_score),
        'explanation': explanation,
        'advisory': advisory
    }

def predict_grid(bounds, resolution):
    """Placeholder for grid-based prediction"""
    pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict Landslide Risk")
    parser.add_argument('--lat', type=float, required=True, help="Latitude")
    parser.add_argument('--lng', type=float, required=True, help="Longitude")
    
    # Just picking a few key features for CLI demo purposes
    parser.add_argument('--elevation', type=float, default=2000)
    parser.add_argument('--slope', type=float, default=35)
    parser.add_argument('--rainfall-current', type=float, default=120)
    parser.add_argument('--rainfall-7day', type=float, default=350)
    
    args = parser.parse_args()
    
    # Mock remaining features for demo
    terrain_features = {
        'elevation': args.elevation,
        'slope': args.slope,
        'aspect': 180,
        'curvature': 0.1,
        'twi': 10,
        'ndvi': 0.5,
        'land_cover': 2,
        'lithology': 3,
        'distance_to_fault': 10,
        'distance_to_road': 5,
        'soil_type': 2,
        'drainage_density': 2.5
    }
    
    rainfall_features = {
        'rainfall_current': args.rainfall_current,
        'rainfall_3day': args.rainfall_current * 2,
        'rainfall_7day': args.rainfall_7day,
        'rainfall_14day': args.rainfall_7day * 1.5,
        'rainfall_intensity': args.rainfall_current / 24,
        'soil_moisture_proxy': 0.8
    }
    
    result = predict_risk(args.lat, args.lng, terrain_features, rainfall_features)
    
    print("\n--- Prediction Results ---")
    print(f"Risk Score: {result['risk_score']:.4f}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Susceptibility Score: {result['susceptibility_score']:.4f}")
    print(f"\nAdvisory:\n{result['advisory']}")
