import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

class TerrainSusceptibilityModel:
    """
    Stage 1 model for terrain susceptibility prediction.
    """
    def __init__(self, model_type='random_forest'):
        """
        Initializes the model.
        
        Args:
            model_type (str): 'random_forest' or 'gradient_boosting'
        """
        self.model_type = model_type
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=200, max_depth=15, class_weight='balanced', random_state=42)
        elif model_type == 'gradient_boosting':
            self.model = GradientBoostingClassifier(n_estimators=200, max_depth=5, random_state=42)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        self.feature_importances_ = None
        
    def train(self, X_terrain, y):
        """
        Trains the model.
        
        Args:
            X_terrain (pd.DataFrame): Terrain features.
            y (pd.Series or np.ndarray): Labels.
        """
        self.model.fit(X_terrain, y)
        self.feature_importances_ = self.model.feature_importances_
        
        preds = self.model.predict(X_terrain)
        probs = self.model.predict_proba(X_terrain)[:, 1]
        
        print("--- Stage 1: Terrain Susceptibility Model Training Metrics ---")
        print(f"Accuracy: {accuracy_score(y, preds):.4f}")
        print(f"Precision: {precision_score(y, preds):.4f}")
        print(f"Recall: {recall_score(y, preds):.4f}")
        print(f"F1-Score: {f1_score(y, preds):.4f}")
        print(f"AUC-ROC: {roc_auc_score(y, probs):.4f}")
        
    def predict_susceptibility(self, X_terrain):
        """
        Predicts susceptibility scores.
        
        Args:
            X_terrain (pd.DataFrame): Terrain features.
            
        Returns:
            np.ndarray: Susceptibility scores [0, 1].
        """
        return self.model.predict_proba(X_terrain)[:, 1]
        
    def save(self, path):
        """
        Saves the model to disk.
        """
        joblib.dump(self.model, path)
        
    def load(self, path):
        """
        Loads the model from disk.
        """
        self.model = joblib.load(path)
        if hasattr(self.model, 'feature_importances_'):
            self.feature_importances_ = self.model.feature_importances_
