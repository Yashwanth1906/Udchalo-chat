from django.contrib import admin
from django.urls import path
from pymodel.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('analyze-flight-feedback/', FlightFeedbackAnalysis.as_view(), name='analyze-flight-feedback'),
    path('predict-controversy/', ControversialDetection.as_view(), name='predict-sarcasm'),
]
