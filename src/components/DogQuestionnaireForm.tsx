import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { DogInfo } from '@/types/dog';

interface DogQuestionnaireFormProps {
  onSubmit: (dogInfo: DogInfo) => void;
  isLoading: boolean;
}

const commonBreeds = [
  'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle',
  'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Siberian Husky',
  'Boxer', 'Boston Terrier', 'Shih Tzu', 'Chihuahua', 'Border Collie', 'Mixed Breed'
];

const commonHealthIssues = [
  'Hip Dysplasia', 'Arthritis', 'Allergies', 'Heart Disease', 'Diabetes',
  'Kidney Disease', 'Liver Disease', 'Cancer', 'Epilepsy', 'Skin Issues',
  'Eye Problems', 'Dental Issues', 'Obesity', 'Anxiety', 'Digestive Issues'
];

const commonSymptoms = [
  'Limping', 'Excessive scratching', 'Loss of appetite', 'Lethargy',
  'Vomiting', 'Diarrhea', 'Excessive thirst', 'Difficulty breathing',
  'Coughing', 'Weight loss', 'Weight gain', 'Bad breath', 'Restlessness'
];

export const DogQuestionnaireForm = ({ onSubmit, isLoading }: DogQuestionnaireFormProps) => {
  const [formData, setFormData] = useState<Partial<DogInfo>>({
    name: '',
    breed: '',
    age: 0,
    weight: 0,
    sex: 'male',
    neutered: false,
    activityLevel: 'moderate',
    previousHealthIssues: [],
    currentMedications: [],
    dietaryPreferences: '',
    allergies: [],
    environment: 'house-small-yard',
    exerciseHours: 1,
    symptoms: []
  });

  const [newHealthIssue, setNewHealthIssue] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.breed && formData.age && formData.weight) {
      onSubmit(formData as DogInfo);
    }
  };

  const addHealthIssue = (issue: string) => {
    if (issue && !formData.previousHealthIssues?.includes(issue)) {
      setFormData(prev => ({
        ...prev,
        previousHealthIssues: [...(prev.previousHealthIssues || []), issue]
      }));
    }
  };

  const removeHealthIssue = (issue: string) => {
    setFormData(prev => ({
      ...prev,
      previousHealthIssues: prev.previousHealthIssues?.filter(h => h !== issue) || []
    }));
  };

  const addSymptom = (symptom: string) => {
    if (symptom && !formData.symptoms?.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), symptom]
      }));
    }
  };

  const removeSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms?.filter(s => s !== symptom) || []
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-large">
      <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">
          Dog Health Assessment Questionnaire
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Dog's Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your dog's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Select
                  value={formData.breed}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, breed: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonBreeds.map(breed => (
                      <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="25"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="Age in years"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min="1"
                  max="200"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                  placeholder="Weight in pounds"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value: 'male' | 'female') => setFormData(prev => ({ ...prev, sex: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="neutered"
                  checked={formData.neutered}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, neutered: checked as boolean }))}
                />
                <Label htmlFor="neutered">Spayed/Neutered</Label>
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value: 'low' | 'moderate' | 'high') => setFormData(prev => ({ ...prev, activityLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Health History */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Health History</h3>
            <div className="space-y-4">
              <div>
                <Label>Previous Health Issues</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.previousHealthIssues?.map(issue => (
                    <Badge key={issue} variant="secondary" className="flex items-center gap-1">
                      {issue}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeHealthIssue(issue)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonHealthIssues.map(issue => (
                    <Button
                      key={issue}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addHealthIssue(issue)}
                      className="text-xs"
                      disabled={formData.previousHealthIssues?.includes(issue)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {issue}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newHealthIssue}
                    onChange={(e) => setNewHealthIssue(e.target.value)}
                    placeholder="Add custom health issue"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      addHealthIssue(newHealthIssue);
                      setNewHealthIssue('');
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label>Current Symptoms</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.symptoms?.map(symptom => (
                    <Badge key={symptom} variant="destructive" className="flex items-center gap-1">
                      {symptom}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSymptom(symptom)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonSymptoms.map(symptom => (
                    <Button
                      key={symptom}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSymptom(symptom)}
                      className="text-xs"
                      disabled={formData.symptoms?.includes(symptom)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Environment & Lifestyle */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Environment & Lifestyle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Living Environment</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, environment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house-small-yard">House with Small Yard</SelectItem>
                    <SelectItem value="house-large-yard">House with Large Yard</SelectItem>
                    <SelectItem value="farm">Farm/Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise">Daily Exercise (hours)</Label>
                <Input
                  id="exercise"
                  type="number"
                  min="0"
                  max="8"
                  step="0.5"
                  value={formData.exerciseHours || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, exerciseHours: parseFloat(e.target.value) || 0 }))}
                  placeholder="Hours per day"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diet">Dietary Preferences/Special Diet</Label>
              <Textarea
                id="diet"
                value={formData.dietaryPreferences}
                onChange={(e) => setFormData(prev => ({ ...prev, dietaryPreferences: e.target.value }))}
                placeholder="Describe any special dietary needs, preferred food brands, or feeding schedule"
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="vet"
            size="lg"
            className="w-full text-lg py-6"
            disabled={isLoading || !formData.name || !formData.breed || !formData.age || !formData.weight}
          >
            {isLoading ? 'Analyzing...' : 'Get Health Assessment & Supplement Recommendations'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};