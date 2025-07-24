import { DogInfo, AssessmentResult, HealthPrediction, SupplementRecommendation } from '@/types/dog';

export class AIAnalysisService {
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('google_ai_api_key', key);
  }

  static getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    this.apiKey = localStorage.getItem('google_ai_api_key');
    return this.apiKey;
  }

  static async analyzeDogHealth(dogInfo: DogInfo): Promise<AssessmentResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google AI API key not found');
    }

    const prompt = this.createAnalysisPrompt(dogInfo);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a highly knowledgeable veterinary health analyst AI specializing in canine health assessment and nutritional supplementation. Your expertise includes:

- Breed-specific health predispositions and genetic conditions
- Age-related health risks and preventive care
- Nutritional science and supplement interactions
- Evidence-based veterinary medicine
- Risk assessment and probability analysis

Always provide accurate, science-based recommendations while emphasizing that your analysis supplements but never replaces professional veterinary care. Be thorough but clear, and always include appropriate disclaimers about seeking professional veterinary advice.

Your response must be a valid JSON object matching the AssessmentResult interface structure exactly.

${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;

      // Parse the JSON response
      let analysisResult: AssessmentResult;
      try {
        analysisResult = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        throw new Error('Invalid response format from AI service');
      }

      // Validate and ensure the response structure is correct
      return this.validateAndFormatResult(analysisResult, dogInfo);

    } catch (error) {
      console.error('AI Analysis error:', error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static createAnalysisPrompt(dogInfo: DogInfo): string {
    return `Please analyze the following dog's health profile and provide a comprehensive health risk assessment with personalized supplement recommendations.

Dog Information:
- Name: ${dogInfo.name}
- Breed: ${dogInfo.breed}
- Age: ${dogInfo.age} years
- Weight: ${dogInfo.weight} lbs
- Sex: ${dogInfo.sex} (${dogInfo.neutered ? 'spayed/neutered' : 'intact'})
- Activity Level: ${dogInfo.activityLevel}
- Exercise Hours: ${dogInfo.exerciseHours} hours/day
- Environment: ${dogInfo.environment}
- Previous Health Issues: ${dogInfo.previousHealthIssues.join(', ') || 'None reported'}
- Current Medications: ${dogInfo.currentMedications.join(', ') || 'None'}
- Current Symptoms: ${dogInfo.symptoms.join(', ') || 'None reported'}
- Dietary Preferences: ${dogInfo.dietaryPreferences || 'Standard diet'}
- Known Allergies: ${dogInfo.allergies.join(', ') || 'None reported'}

Based on this information, please provide a detailed analysis including:

1. Health risk assessment with specific conditions, their probability percentages, and prevention strategies
2. Evidence-based supplement recommendations with proper dosages, frequencies, and safety considerations
3. General health advice tailored to this specific dog
4. Assessment confidence level
5. Whether immediate veterinary consultation is recommended

Please respond with a JSON object that exactly matches this structure:

{
  "dogInfo": <the provided dog info>,
  "healthPredictions": {
    "riskLevel": "low|moderate|high",
    "conditions": [
      {
        "name": "condition name",
        "probability": number (0-100),
        "description": "detailed description",
        "prevention": ["prevention strategy 1", "prevention strategy 2"]
      }
    ]
  },
  "supplementRecommendations": [
    {
      "name": "supplement name",
      "purpose": "why this supplement is recommended",
      "dosage": "specific dosage recommendation",
      "frequency": "how often to give",
      "benefits": ["benefit 1", "benefit 2"],
      "precautions": ["precaution 1", "precaution 2"],
      "priority": "essential|recommended|optional"
    }
  ],
  "generalAdvice": ["advice 1", "advice 2", "advice 3"],
  "vetVisitRecommended": boolean,
  "confidence": number (0-100)
}

Important: Base your analysis on current veterinary science, breed-specific research, and recognized nutritional guidelines. Consider breed predispositions, age-related risks, and the dog's current health status. Prioritize safety and always recommend veterinary consultation for concerning symptoms.`;
  }

  private static validateAndFormatResult(result: any, originalDogInfo: DogInfo): AssessmentResult {
    // Ensure the result has the correct structure and include the original dog info
    return {
      dogInfo: originalDogInfo,
      healthPredictions: {
        riskLevel: result.healthPredictions?.riskLevel || 'moderate',
        conditions: result.healthPredictions?.conditions || []
      },
      supplementRecommendations: result.supplementRecommendations || [],
      generalAdvice: result.generalAdvice || [],
      vetVisitRecommended: result.vetVisitRecommended || false,
      confidence: Math.min(Math.max(result.confidence || 70, 0), 100)
    };
  }
}