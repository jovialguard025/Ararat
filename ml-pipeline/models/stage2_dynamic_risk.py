import joblib
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import pandas as pd

class DynamicRiskModel:
    """
    Stage 2 model for dynamic rainfall-triggered risk prediction.
    """
    def __init__(self, model_type='gradient_boosting'):
        """
        Initializes the dynamic risk model.
        
        Args:
            model_type (str): 'gradient_boosting' or 'random_forest'
        """
        self.model_type = model_type
        if model_type == 'gradient_boosting':
            self.model = GradientBoostingClassifier(n_estimators=200, learning_rate=0.05, max_depth=5, random_state=42)
        elif model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
            
    def train(self, X_combined, y):
        """
        Trains the stage 2 model.
        
        Args:
            X_combined (pd.DataFrame): Features including susceptibility_score and rainfall features.
            y (pd.Series or np.ndarray): Labels.
        """
        self.model.fit(X_combined, y)
        preds = self.model.predict(X_combined)
        probs = self.model.predict_proba(X_combined)[:, 1]
        
        print("--- Stage 2: Dynamic Risk Model Training Metrics ---")
        print(f"Accuracy: {accuracy_score(y, preds):.4f}")
        print(f"Precision: {precision_score(y, preds):.4f}")
        print(f"Recall: {recall_score(y, preds):.4f}")
        print(f"F1-Score: {f1_score(y, preds):.4f}")
        print(f"AUC-ROC: {roc_auc_score(y, probs):.4f}")
        
    def predict_risk(self, X_combined):
        """
        Predicts dynamic risk probabilities.
        
        Args:
            X_combined (pd.DataFrame): Features including susceptibility_score and rainfall features.
            
        Returns:
            np.ndarray: Risk probabilities [0, 1].
        """
        return self.model.predict_proba(X_combined)[:, 1]
        
    def save(self, path):
        """Saves model to disk."""
        joblib.dump(self.model, path)
        
    def load(self, path):
        """Loads model from disk."""
        self.model = joblib.load(path)
