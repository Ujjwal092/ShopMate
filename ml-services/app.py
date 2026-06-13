from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

app = Flask(__name__)
CORS(app)

# Training data — reviews + labels
training_reviews = [
    "excellent product love it amazing quality",
    "great value for money highly recommend",
    "best purchase ever fantastic",
    "good product works well satisfied",
    "okay product average quality",
    "not bad decent product",
    "poor quality waste of money",
    "terrible product dont buy worst ever",
    "bad experience very disappointed",
    "broken product useless garbage"
]

labels = [2, 2, 2, 2, 1, 1, 0, 0, 0, 0]
# 2 = Positive, 1 = Neutral, 0 = Negative

# Train model
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(training_reviews)

model = MultinomialNB()
model.fit(X, labels)

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.json
    review_text = data.get('review', '')
    
    if not review_text:
        return jsonify({'error': 'No review provided'}), 400
    
    # Predict
    X_test = vectorizer.transform([review_text])
    prediction = model.predict(X_test)[0]
    confidence = np.max(model.predict_proba(X_test)) * 100
    
    sentiment_map = {2: 'positive', 1: 'neutral', 0: 'negative'}
    sentiment = sentiment_map[prediction]
    
    return jsonify({
        'sentiment': sentiment,
        'confidence': round(float(confidence), 2),
        'review': review_text
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML service running!'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)