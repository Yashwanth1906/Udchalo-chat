from transformers import pipeline

# Load the zero-shot classification model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def get_flight_feedback(sentences):
    labels = ["flight experience and service", "general travel", "unrelated"]
    flight_feedback = []

    for sentence in sentences:
        result = classifier(sentence, labels)
        if result["labels"][0] == "flight experience and service":
            flight_feedback.append(sentence)

    return flight_feedback

# Test examples
sentences = [
     # General travel (should be ignored)
]

# Get and print flight-related feedback
conversation = get_flight_feedback(sentences)

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load the sarcasm detection model and tokenizer
sarcasm_model_name = "dnzblgn/Sarcasm-Detection-Customer-Reviews"
sarcasm_tokenizer = AutoTokenizer.from_pretrained(sarcasm_model_name)
sarcasm_model = AutoModelForSequenceClassification.from_pretrained(sarcasm_model_name)

# Load the sentiment analysis model and tokenizer
sentiment_model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_model_name)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(sentiment_model_name)

# Sentiment mapping (1-5 scale)
sentiment_map = {0: "Very Negative", 1: "Negative", 2: "Neutral", 3: "Positive", 4: "Very Positive"}
sentiment_value_map = {"Very Negative": 1, "Negative": 2, "Neutral": 3, "Positive": 4, "Very Positive": 5}

# Sarcasm detection mapping
sarcasm_map = {0: "Not Sarcastic", 1: "Sarcastic"}
sarcasm_value_map = {"Not Sarcastic": 1, "Sarcastic": 2}

# Function to predict sarcasm
def predict_sarcasm(texts):
    inputs = sarcasm_tokenizer(texts, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = sarcasm_model(**inputs)
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    sarcasm_labels = [sarcasm_map[p] for p in torch.argmax(probabilities, dim=-1).tolist()]
    return sarcasm_labels

# Function to predict sentiment
def predict_sentiment(texts):
    inputs = sentiment_tokenizer(texts, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = sentiment_model(**inputs)
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    sentiment_labels = [sentiment_map[p] for p in torch.argmax(probabilities, dim=-1).tolist()]
    return sentiment_labels


# Function to calculate adjusted sentiment considering sarcasm
def calculate_adjusted_sentiment(texts):
    # Predict sentiment and sarcasm for each text
    sentiment_labels = predict_sentiment(texts)
    sarcasm_labels = predict_sarcasm(texts)
    
    # Adjust sentiment if sarcasm is detected
    adjusted_sentiments = []
    for sentiment, sarcasm in zip(sentiment_labels, sarcasm_labels):
        if sarcasm == "Sarcastic":
            # If sarcastic, reverse the sentiment score
            if sentiment == "Very Positive":
                adjusted_sentiments.append("Very Negative")
            elif sentiment == "Positive":
                adjusted_sentiments.append("Negative")
            elif sentiment == "Neutral":
                adjusted_sentiments.append("Neutral")  # Neutral stays neutral even with sarcasm
            elif sentiment == "Negative":
                adjusted_sentiments.append("Positive")
            elif sentiment == "Very Negative":
                adjusted_sentiments.append("Very Positive")
        else:
            adjusted_sentiments.append(sentiment)
    
    adjusted_sentiment_scores = [sentiment_value_map[s] for s in adjusted_sentiments]
    return sum(adjusted_sentiment_scores) / len(adjusted_sentiment_scores)

sentiment_score = calculate_adjusted_sentiment(conversation)
print(f"Adjusted Sentiment Score for the conversation: {sentiment_score:.2f}")