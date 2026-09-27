import pandas as pd
import numpy as np
from sklearn.model_selection import GroupKFold
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score
from sklearn.ensemble import GradientBoostingClassifier

from data_generator import generate_full_dataset
from models.stage1_susceptibility import TerrainSusceptibilityModel
from models.stage2_dynamic_risk import DynamicRiskModel

def validate():
    print("Generating validation dataset (n=5000)...")
    X_terrain, X_rainfall, X_combined, y = generate_full_dataset(5000)
    
    # Create spatial groups based on a rough lat/lng grid
    lat_bins = pd.cut(X_combined['latitude'], bins=5, labels=False)
    lng_bins = pd.cut(X_combined['longitude'], bins=5, labels=False)
    groups = lat_bins.astype(str) + "_" + lng_bins.astype(str)
    
    gkf = GroupKFold(n_splits=5)
    
    metrics = {'precision': [], 'recall': [], 'f1': [], 'auc': []}
    baseline_metrics = {'precision': [], 'recall': [], 'f1': [], 'auc': []}
    
    for train_idx, test_idx in gkf.split(X_combined, y, groups=groups):
        # Two-stage pipeline
        # Stage 1
        X_t_train, X_t_test = X_terrain.iloc[train_idx], X_terrain.iloc[test_idx]
        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
        
        stage1 = TerrainSusceptibilityModel('random_forest')
        stage1.train(X_t_train, y_train)
        
        s1_train_scores = stage1.predict_susceptibility(X_t_train)
        s1_test_scores = stage1.predict_susceptibility(X_t_test)
        
        # Stage 2
        X_r_train = X_rainfall.iloc[train_idx].copy()
        X_r_train['susceptibility_score'] = s1_train_scores
        X_r_test = X_rainfall.iloc[test_idx].copy()
        X_r_test['susceptibility_score'] = s1_test_scores
        
        stage2 = DynamicRiskModel('gradient_boosting')
        stage2.train(X_r_train, y_train)
        preds = stage2.model.predict(X_r_test)
        probs = stage2.predict_risk(X_r_test)
        
        metrics['precision'].append(precision_score(y_test, preds, zero_division=0))
        metrics['recall'].append(recall_score(y_test, preds, zero_division=0))
        metrics['f1'].append(f1_score(y_test, preds, zero_division=0))
        metrics['auc'].append(roc_auc_score(y_test, probs))
        
        # Baseline (Single-stage)
        features = list(X_terrain.columns) + list(X_rainfall.columns)
        X_train_full = pd.concat([X_terrain.iloc[train_idx], X_rainfall.iloc[train_idx]], axis=1)
        X_test_full = pd.concat([X_terrain.iloc[test_idx], X_rainfall.iloc[test_idx]], axis=1)
        
        baseline = GradientBoostingClassifier(n_estimators=200, random_state=42)
        baseline.fit(X_train_full, y_train)
        b_preds = baseline.predict(X_test_full)
        b_probs = baseline.predict_proba(X_test_full)[:, 1]
        
        baseline_metrics['precision'].append(precision_score(y_test, b_preds, zero_division=0))
        baseline_metrics['recall'].append(recall_score(y_test, b_preds, zero_division=0))
        baseline_metrics['f1'].append(f1_score(y_test, b_preds, zero_division=0))
        baseline_metrics['auc'].append(roc_auc_score(y_test, b_probs))
        
    print("\n=== Validation Results (Spatial Cross-Validation) ===")
    print(f"{'Metric':<15} | {'Two-Stage':<10} | {'Baseline':<10}")
    print("-" * 40)
    for k in metrics.keys():
        m_val = np.mean(metrics[k])
        b_val = np.mean(baseline_metrics[k])
        print(f"{k.capitalize():<15} | {m_val:.4f}     | {b_val:.4f}")

if __name__ == "__main__":
    validate()
