import { useState, useEffect } from 'react';
import { DogQuestionnaireForm } from '@/components/DogQuestionnaireForm';
import { AssessmentResults } from '@/components/AssessmentResults';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Pill, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIAnalysisService } from '@/services/aiAnalysis';
import { DogInfo, AssessmentResult } from '@/types/dog';
import heroImage from '@/assets/hero-dog.jpg';

const Index = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const apiKey = AIAnalysisService.getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  const handleApiKeySet = (key: string) => {
    AIAnalysisService.setApiKey(key);
    setHasApiKey(true);
  };

  const handleDogAssessment = async (dogInfo: DogInfo) => {
    setIsAnalyzing(true);
    
    try {
      const result = await AIAnalysisService.analyzeDogHealth(dogInfo);
      setAssessmentResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Health assessment for ${dogInfo.name} has been completed successfully.`,
      });
    } catch (error) {
      console.error('Assessment error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze dog health",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAssessment = () => {
    setAssessmentResult(null);
  };

  if (!hasApiKey) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  if (assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-8 px-4">
        <AssessmentResults 
          result={assessmentResult} 
          onNewAssessment={handleNewAssessment}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Happy dog with stethoscope"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        </div>
        
        <div className="relative z-10 text-center py-24 px-4">
          <div className="max-w-4xl mx-auto text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              AI-Powered Dog Health Assessment
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Predict potential health issues and get personalized supplement recommendations 
              for your furry friend with advanced AI analysis
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span>Health Risk Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="h-6 w-6" />
                <span>Supplement Recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6" />
                <span>Personalized Care Plans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes your dog's breed, age, lifestyle, and health history to provide 
              comprehensive health insights and tailored supplement recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center shadow-medium hover:shadow-large transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Complete Health Profile</h3>
                <p className="text-muted-foreground">
                  Detailed questionnaire covering breed, age, lifestyle, symptoms, and health history 
                  for comprehensive analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-medium hover:shadow-large transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Advanced AI analyzes breed-specific risks, age-related conditions, and lifestyle 
                  factors to predict potential health issues.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-medium hover:shadow-large transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Pill className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Personalized Supplements</h3>
                <p className="text-muted-foreground">
                  Evidence-based supplement recommendations with dosages, frequencies, and 
                  safety considerations tailored to your dog.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Assessment Form Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Star className="h-8 w-8 text-accent" />
              Start Your Dog's Health Assessment
            </h2>
            <p className="text-lg text-muted-foreground">
              Complete the questionnaire below to get personalized health insights and supplement recommendations.
            </p>
          </div>

          <DogQuestionnaireForm 
            onSubmit={handleDogAssessment}
            isLoading={isAnalyzing}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="py-8 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This AI assessment is for informational purposes only and should not replace 
            professional veterinary care. Always consult with a qualified veterinarian for medical decisions regarding your pet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
