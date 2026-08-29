package com.smartcommunication.ai;

import org.springframework.stereotype.Component;

@Component
public class SentimentAnalyzer {

    public enum SentimentCategory {
        VERY_POSITIVE,
        POSITIVE,
        NEUTRAL,
        NEGATIVE,
        VERY_NEGATIVE
    }

    public SentimentCategory categorizeScore(double score) {
        if (score >= 0.6) {
            return SentimentCategory.VERY_POSITIVE;
        } else if (score >= 0.2) {
            return SentimentCategory.POSITIVE;
        } else if (score >= -0.2) {
            return SentimentCategory.NEUTRAL;
        } else if (score >= -0.6) {
            return SentimentCategory.NEGATIVE;
        } else {
            return SentimentCategory.VERY_NEGATIVE;
        }
    }

    public boolean requiresUrgentEscalation(double score) {
        return categorizeScore(score) == SentimentCategory.VERY_NEGATIVE;
    }
}
