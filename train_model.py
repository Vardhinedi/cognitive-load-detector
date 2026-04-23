import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# -------- Load Dataset --------
with open("dataset.json", "r") as f:
    data = json.load(f)

# -------- Prepare Features --------
X = []
y = []

for sample in data:
    X.append([
        sample["avgVelocity"],
        sample["varVelocity"],
        sample["avgInterval"],
        sample["varTyping"],
        sample["avgScroll"],
        sample["varScroll"]
    ])
    y.append(sample["label"])

# -------- Train/Test Split --------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# -------- Train Model --------
model = RandomForestClassifier()
model.fit(X_train, y_train)

# -------- Evaluate --------
y_pred = model.predict(X_test)

print("\nModel Evaluation:\n")
print(classification_report(y_test, y_pred))

# -------- Feature Importance --------
print("\nFeature Importance:\n")
for i, importance in enumerate(model.feature_importances_):
    print(f"Feature {i}: {importance:.3f}")