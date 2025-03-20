import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Load the dataset
df = pd.read_csv('cpu_scheduler_dataset.csv')

# Preprocess features
features = df[['avg_arrival', 'avg_burst', 'avg_priority', 'std_burst', 'num_processes']]
features['std_burst'].fillna(features['std_burst'].mean(), inplace=True)

# Encode the target labels
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(df['best_algo'])

# Train-test split (optional)
X_train, X_test, y_train, y_test = train_test_split(features, labels_encoded, test_size=0.2, random_state=42)

# Train the model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save the trained model
joblib.dump(rf_model, 'model.pkl')

# Save label encoder (optional, if you want the mapping later)
joblib.dump(label_encoder, 'label_encoder.pkl')

print("Model and label encoder exported successfully!")
