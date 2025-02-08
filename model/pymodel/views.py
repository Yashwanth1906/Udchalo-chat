from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load the zero-shot classification model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Load the sarcasm detection model and tokenizer
sarcasm_model_name = "dnzblgn/Sarcasm-Detection-Customer-Reviews"
sarcasm_tokenizer = AutoTokenizer.from_pretrained(sarcasm_model_name)
sarcasm_model = AutoModelForSequenceClassification.from_pretrained(sarcasm_model_name)

# Load the sentiment analysis model and tokenizer
sentiment_model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_model_name)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(sentiment_model_name)

# Sentiment mapping
sentiment_map = {0: "Very Negative", 1: "Negative", 2: "Neutral", 3: "Positive", 4: "Very Positive"}
sentiment_value_map = {"Very Negative": 1, "Negative": 2, "Neutral": 3, "Positive": 4, "Very Positive": 5}

# Sarcasm detection mapping
sarcasm_map = {0: "Not Sarcastic", 1: "Sarcastic"}
sarcasm_value_map = {"Not Sarcastic": 1, "Sarcastic": 2}

# Function to extract flight-related feedback
def get_flight_feedback(sentences):
    labels = ["flight experience and service", "general travel", "unrelated"]
    flight_feedback = []
    for sentence in sentences:
        result = classifier(sentence, labels)
        if result["labels"][0] == "flight experience and service":
            flight_feedback.append(sentence)
    return flight_feedback

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

# Function to calculate adjusted sentiment score
def calculate_adjusted_sentiment(texts):
    sentiment_labels = predict_sentiment(texts)
    sarcasm_labels = predict_sarcasm(texts)
    adjusted_sentiments = []
    for sentiment, sarcasm in zip(sentiment_labels, sarcasm_labels):
        if sarcasm == "Sarcastic":
            if sentiment == "Very Positive":
                adjusted_sentiments.append("Very Negative")
            elif sentiment == "Positive":
                adjusted_sentiments.append("Negative")
            elif sentiment == "Neutral":
                adjusted_sentiments.append("Neutral")
            elif sentiment == "Negative":
                adjusted_sentiments.append("Positive")
            elif sentiment == "Very Negative":
                adjusted_sentiments.append("Very Positive")
        else:
            adjusted_sentiments.append(sentiment)
    adjusted_sentiment_scores = [sentiment_value_map[s] for s in adjusted_sentiments]
    return sum(adjusted_sentiment_scores) / len(adjusted_sentiment_scores)

# API Endpoint using Django REST Framework
class FlightFeedbackAnalysis(APIView):
    def post(self, request):
        sentences = request.data.get("sentences", [])
        if not sentences:
            return Response({"error": "No sentences provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        conversation = get_flight_feedback(sentences)
        if not conversation:
            return Response({"message": "No flight-related feedback found"}, status=status.HTTP_200_OK)
        
        sentiment_score = calculate_adjusted_sentiment(conversation)
        return Response({"adjusted_sentiment_score": round(sentiment_score, 2)})

# Load the classifier model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Function to check if a message is controversial
def is_controversial(message):
    categories = [
        "politics", "religion", "violence", "misinformation",
        "race", "gender", "health", "immigration", "social justice",
        "privacy", "environment", "body shaming", "eve teasing", "curse words", "bad words"
    ]
    
    result = classifier(message, candidate_labels=categories)
    
    # Get the highest-scoring category
    max_score = max(result['scores'])
    top_category = result['labels'][result['scores'].index(max_score)]
    
    # Define a threshold for flagging a message as controversial
    threshold = 0.6
    
    return 1 if max_score > threshold else 0

# API Endpoint using Django REST Framework
class ControversialDetection(APIView):
    def post(self, request):
        message = request.data.get("message", "")
        if not message:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        result = is_controversial(message)
        return Response({"is_controversial": result})



