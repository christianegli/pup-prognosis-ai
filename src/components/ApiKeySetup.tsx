import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Google AI API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      toast({
        title: "Error",
        description: "Google AI API keys should start with 'AIza'",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Validate the API key with a simple request
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

      if (response.ok) {
        onApiKeySet(apiKey);
        toast({
          title: "Success",
          description: "API key validated and saved successfully!",
        });
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Key className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Setup Required</CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter your Google AI API key to enable AI-powered health analysis
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Google AI API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="vet"
              className="w-full"
              disabled={isValidating || !apiKey.trim()}
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate & Continue
                </>
              )}
            </Button>
          </form>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-foreground">Privacy & Security</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your API key is stored locally in your browser</li>
                  <li>• We never store or transmit your API key to our servers</li>
                  <li>• All AI analysis requests go directly to Google AI</li>
                  <li>• You can remove your key anytime by clearing browser data</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p>Don't have a Google AI API key?</p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Get one from Google AI Studio →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};