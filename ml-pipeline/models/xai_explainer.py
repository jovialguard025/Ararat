import shap
import numpy as np

class RiskExplainer:
    """
    SHAP-based explainability layer for risk prediction.
    """
    def __init__(self, model, feature_names):
        """
        Initializes the explainer.
        
        Args:
            model: Trained machine learning model.
            feature_names (list): List of feature names.
        """
        self.model = model
        self.feature_names = feature_names
        # Using TreeExplainer as we use tree-based models (RF, GBM)
        self.explainer = shap.TreeExplainer(model)
        
    def explain_single(self, X_single):
        """
        Explains a single prediction.
        
        Args:
            X_single (pd.DataFrame or np.ndarray): A single data point.
            
        Returns:
            dict: Feature name to SHAP value mapping.
        """
        shap_values = self.explainer.shap_values(X_single)
        # For binary classification, shap_values might be a list of arrays (one for each class)
        if isinstance(shap_values, list):
            vals = shap_values[1][0]
        else:
            vals = shap_values[0]
            
        return dict(zip(self.feature_names, vals))
        
    def explain_batch(self, X_batch):
        """
        Explains a batch of predictions.
        
        Args:
            X_batch (pd.DataFrame): Batch of data points.
            
        Returns:
            list: List of dictionaries mapping feature names to SHAP values.
        """
        shap_values = self.explainer.shap_values(X_batch)
        if isinstance(shap_values, list):
            vals = shap_values[1]
        else:
            vals = shap_values
            
        explanations = []
        for i in range(len(vals)):
            explanations.append(dict(zip(self.feature_names, vals[i])))
        return explanations
        
    def get_feature_importance(self):
        """
        Not directly implementable without global dataset, but typically one averages absolute SHAP values.
        Placeholder implementation.
        """
        return "Requires global SHAP values computation."
        
    def generate_risk_advisory(self, prediction, explanation):
        """
        Generates a human-readable advisory string based on prediction and SHAP explanation.
        
        Args:
            prediction (float): Predicted risk score [0, 1].
            explanation (dict): SHAP explanation dictionary.
            
        Returns:
            str: Human-readable advisory.
        """
        if prediction >= 0.75:
            level = "CRITICAL"
        elif prediction >= 0.5:
            level = "HIGH"
        elif prediction >= 0.25:
            level = "MEDIUM"
        else:
            level = "LOW"
            
        # Sort factors by their contribution (SHAP value)
        sorted_factors = sorted(explanation.items(), key=lambda item: item[1], reverse=True)
        top_factors = [f"{k.replace('_', ' ').capitalize()} (SHAP: +{v:.2f})" for k, v in sorted_factors[:3] if v > 0]
        
        factor_str = ", ".join(top_factors) if top_factors else "No significant elevated factors"
        
        return f"{level} RISK ({prediction:.2f}): Primary factors — {factor_str}"
