import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Smile, Briefcase, Coffee } from "lucide-react";

interface Step5AIResponsesProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step5AIResponses = ({ data, onDataChange, onNext, onPrevious }: Step5AIResponsesProps) => {
  const [aiEnabled, setAiEnabled] = useState(data.ai_responses_enabled ?? true);
  const [personalityStyle, setPersonalityStyle] = useState(data.personality_style || 'professional');
  const [responseDelay, setResponseDelay] = useState([data.response_delay_hours || 2]);
  const [autoApproveSettings, setAutoApproveSettings] = useState({
    positive: data.auto_approve_positive ?? true,
    neutral: data.auto_approve_neutral ?? false,
    negative: data.auto_approve_negative ?? false
  });

  const personalities = [
    {
      id: 'professional',
      name: 'Professional',
      icon: Briefcase,
      description: 'Formal, courteous, and business-focused responses',
      example: 'Thank you for taking the time to leave us this review. We appreciate your feedback and are committed to providing excellent service.'
    },
    {
      id: 'friendly',
      name: 'Friendly',
      icon: Smile,
      description: 'Warm, personal, and approachable responses',
      example: 'Thank you so much for this wonderful review! We\'re absolutely delighted that you had such a great experience with us.'
    },
    {
      id: 'casual',
      name: 'Casual',
      icon: Coffee,
      description: 'Relaxed, informal, and conversational responses',
      example: 'Thanks for the great review! Really happy we could help you out. Hope to see you again soon!'
    }
  ];

  const updateAISettings = (updates: any) => {
    const reviewSettings = {
      ai_responses_enabled: aiEnabled,
      personality_style: personalityStyle,
      response_delay_hours: responseDelay[0],
      auto_approve_positive: autoApproveSettings.positive,
      auto_approve_neutral: autoApproveSettings.neutral,
      auto_approve_negative: autoApproveSettings.negative,
      ...updates
    };
    
    onDataChange({
      ...data,
      ...reviewSettings
    });
  };

  const handlePersonalityChange = (personality: string) => {
    setPersonalityStyle(personality);
    updateAISettings({ personality_style: personality });
  };

  const handleAutoApproveChange = (type: 'positive' | 'neutral' | 'negative', value: boolean) => {
    const updated = { ...autoApproveSettings, [type]: value };
    setAutoApproveSettings(updated);
    updateAISettings({
      auto_approve_positive: updated.positive,
      auto_approve_neutral: updated.neutral,
      auto_approve_negative: updated.negative
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Step 5: AI Review Response Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Enable AI Review Responses</Label>
            <p className="text-sm text-muted-foreground">
              Automatically respond to customer reviews with AI-generated responses
            </p>
          </div>
          <Switch
            checked={aiEnabled}
            onCheckedChange={(checked) => {
              setAiEnabled(checked);
              updateAISettings({ ai_responses_enabled: checked });
            }}
          />
        </div>

        {aiEnabled && (
          <>
            <div>
              <Label className="text-base font-medium">Response Personality Style</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the tone and style for your AI responses
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {personalities.map((personality) => {
                  const Icon = personality.icon;
                  return (
                    <div
                      key={personality.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        personalityStyle === personality.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handlePersonalityChange(personality.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{personality.name}</span>
                        {personalityStyle === personality.id && (
                          <Badge variant="secondary" className="ml-auto">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {personality.description}
                      </p>
                      <div className="bg-muted p-2 rounded text-xs italic">
                        "{personality.example}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Response Timing</Label>
              <p className="text-sm text-muted-foreground mb-4">
                How long should we wait before responding to reviews?
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Response delay: {responseDelay[0]} hours</span>
                  <Badge variant="outline">{responseDelay[0] === 0 ? 'Immediate' : `${responseDelay[0]}h delay`}</Badge>
                </div>
                <Slider
                  value={responseDelay}
                  onValueChange={(value) => {
                    setResponseDelay(value);
                    updateAISettings({ response_delay_hours: value[0] });
                  }}
                  max={24}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Immediate</span>
                  <span>24 hours</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Auto-Approval Settings</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Which types of responses should be posted automatically?
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="font-medium">Positive Reviews</span>
                    </div>
                    <p className="text-sm text-muted-foreground">4-5 star reviews</p>
                  </div>
                  <Switch
                    checked={autoApproveSettings.positive}
                    onCheckedChange={(checked) => handleAutoApproveChange('positive', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span className="font-medium">Neutral Reviews</span>
                    </div>
                    <p className="text-sm text-muted-foreground">3 star reviews</p>
                  </div>
                  <Switch
                    checked={autoApproveSettings.neutral}
                    onCheckedChange={(checked) => handleAutoApproveChange('neutral', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="font-medium">Negative Reviews</span>
                    </div>
                    <p className="text-sm text-muted-foreground">1-2 star reviews</p>
                  </div>
                  <Switch
                    checked={autoApproveSettings.negative}
                    onCheckedChange={(checked) => handleAutoApproveChange('negative', checked)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="escalation_keywords">Escalation Keywords (Optional)</Label>
              <Textarea
                id="escalation_keywords"
                value={data.escalation_keywords?.join(', ') || ""}
                onChange={(e) => {
                  const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                  updateAISettings({ escalation_keywords: keywords });
                }}
                placeholder="lawsuit, legal, solicitor, trading standards, refund, complaint"
                rows={2}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Comma-separated keywords that should always require manual review
              </p>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};