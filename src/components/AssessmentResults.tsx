import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Heart, Shield, Pill, Star, CheckCircle } from 'lucide-react';
import { AssessmentResult } from '@/types/dog';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onNewAssessment: () => void;
}

export const AssessmentResults = ({ result, onNewAssessment }: AssessmentResultsProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-secondary text-secondary-foreground';
      case 'moderate': return 'bg-accent text-accent-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return 'bg-destructive text-destructive-foreground';
      case 'recommended': return 'bg-accent text-accent-foreground';
      case 'optional': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <Card className="shadow-large">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Heart className="h-8 w-8" />
            Health Assessment for {result.dogInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Badge className={`${getRiskColor(result.healthPredictions.riskLevel)} text-lg px-4 py-2`}>
                Overall Risk: {result.healthPredictions.riskLevel.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <Progress value={result.confidence} className="w-24" />
                <span className="text-sm font-medium">{result.confidence}%</span>
              </div>
            </div>
            {result.vetVisitRecommended && (
              <div className="flex items-center justify-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Veterinary consultation recommended</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Predictions */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-vet-blue" />
              Potential Health Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.healthPredictions.conditions.map((condition, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-gradient-subtle">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">{condition.name}</h4>
                  <Badge variant="outline" className="text-sm">
                    {Math.round(condition.probability)}% risk
                  </Badge>
                </div>
                <Progress value={condition.probability} className="h-2" />
                <p className="text-muted-foreground text-sm">{condition.description}</p>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Prevention Strategies:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {condition.prevention.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Supplement Recommendations */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-6 w-6 text-vet-green" />
              Supplement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.supplementRecommendations
              .sort((a, b) => {
                const priorityOrder = { essential: 0, recommended: 1, optional: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((supplement, index) => (
                <div key={index} className="space-y-3 p-4 rounded-lg bg-gradient-subtle">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">{supplement.name}</h4>
                    <Badge className={getPriorityColor(supplement.priority)}>
                      {supplement.priority === 'essential' && <Star className="h-3 w-3 mr-1" />}
                      {supplement.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{supplement.purpose}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Dosage:</span> {supplement.dosage}
                    </div>
                    <div>
                      <span className="font-medium">Frequency:</span> {supplement.frequency}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {supplement.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  {supplement.precautions.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm text-destructive">Precautions:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                        {supplement.precautions.map((precaution, precautionIndex) => (
                          <li key={precautionIndex}>{precaution}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* General Advice */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-vet-orange" />
            General Health Advice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.generalAdvice.map((advice, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-vet-green mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{advice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="shadow-medium border-2 border-accent">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Important Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                This assessment is for informational purposes only and should not replace professional veterinary advice. 
                Always consult with a qualified veterinarian before making decisions about your pet's health or starting 
                any new supplements or treatments. If your dog is showing concerning symptoms, please seek veterinary 
                care immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={onNewAssessment}
          variant="vet"
          size="lg"
          className="text-lg px-8 py-4"
        >
          Assess Another Dog
        </Button>
      </div>
    </div>
  );
};