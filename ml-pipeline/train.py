import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import joblib

from config import MODEL_DIR, RAINFALL_FEATURES
from data_generator import generate_full_dataset
from models.stage1_susceptibility import TerrainSusceptibilityModel
from models.stage2_dynamic_risk import DynamicRiskModel
from models.xai_explainer import RiskExplainer

def main():
    print("Generating synthetic dataset (n=10000)...")
    X_terrain, X_rainfall, X_combined, y = generate_full_dataset(10000)
    
    # Split data
    X_t_train, X_t_test, X_r_train, X_r_test, y_train, y_test = train_test_split(
        X_terrain, X_rainfall, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train Stage 1
    print("\nTraining Stage 1: Terrain Susceptibility Model...")
    stage1 = TerrainSusceptibilityModel(model_type='random_forest')
    stage1.train(X_t_train, y_train)
    
    # Save Stage 1
    stage1_path = os.path.join(MODEL_DIR, 'stage1_model.joblib')
    stage1.save(stage1_path)
    print(f"Stage 1 model saved to {stage1_path}")
    
    # Generate Susceptibility scores for Stage 2
    print("\nGenerating Susceptibility scores for Stage 2...")
    s1_train_scores = stage1.predict_susceptibility(X_t_train)
    s1_test_scores = stage1.predict_susceptibility(X_t_test)
    
    # Prepare Stage 2 features
    X_s2_train = X_r_train.copy()
    X_s2_train['susceptibility_score'] = s1_train_scores
    
    X_s2_test = X_r_test.copy()
    X_s2_test['susceptibility_score'] = s1_test_scores
    
    # Train Stage 2
    print("\nTraining Stage 2: Dynamic Risk Model...")
    stage2 = DynamicRiskModel(model_type='gradient_boosting')
    stage2.train(X_s2_train, y_train)
    
    # Save Stage 2
    stage2_path = os.path.join(MODEL_DIR, 'stage2_model.joblib')
    stage2.save(stage2_path)
    print(f"Stage 2 model saved to {stage2_path}")
    
    # Evaluate Stage 2 on test set
    preds = stage2.model.predict(X_s2_test)
    print("\n--- Test Set Evaluation (Stage 2) ---")
    cm = confusion_matrix(y_test, preds)
    print("Confusion Matrix:")
    print(cm)
    
    # XAI Setup
    print("\nSetting up SHAP Explainer...")
    feature_names = list(X_s2_train.columns)
    explainer = RiskExplainer(stage2.model, feature_names)
    
    # Explain a sample prediction
    sample_idx = 0
    sample = X_s2_test.iloc[[sample_idx]]
    prediction = stage2.predict_risk(sample)[0]
    explanation = explainer.explain_single(sample)
    advisory = explainer.generate_risk_advisory(prediction, explanation)
    
    print("\nSample Prediction Advisory:")
    print(advisory)

if __name__ == "__main__":
    main()
