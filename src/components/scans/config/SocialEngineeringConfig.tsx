import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SocialEngineeringConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const SocialEngineeringConfig = ({ config, onChange }: SocialEngineeringConfigProps) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-pink-200 bg-pink-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Social Engineering Simulation Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="attack_type">Attack Type</Label>
          <Select value={config.attack_type || "phishing"} onValueChange={(value) => updateConfig('attack_type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phishing">Phishing</SelectItem>
              <SelectItem value="smishing">Smishing</SelectItem>
              <SelectItem value="vishing">Vishing</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600 mt-1">Select the type of social engineering attack to simulate</p>
        </div>

        {config.attack_type === 'phishing' && (
          <>
            <div>
              <Label htmlFor="target_emails_file_path">Target Emails File Path (Server-Side)</Label>
              <Input
                id="target_emails_file_path"
                value={config.target_emails_file_path || ""}
                onChange={(e) => updateConfig('target_emails_file_path', e.target.value)}
                placeholder="/data/targets/emails.txt"
              />
              <p className="text-xs text-gray-600 mt-1">Path to a file on the server containing target email addresses for phishing</p>
            </div>
            
            <div>
              <Label htmlFor="phishing_template_path">Phishing Template Path (Server-Side)</Label>
              <Input
                id="phishing_template_path"
                value={config.phishing_template_path || ""}
                onChange={(e) => updateConfig('phishing_template_path', e.target.value)}
                placeholder="/data/phishing_templates/invoice.html"
              />
              <p className="text-xs text-gray-600 mt-1">Path to the HTML phishing email template on the server</p>
            </div>
          </>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable_awareness_training"
            checked={config.enable_awareness_training ?? true}
            onCheckedChange={(checked) => updateConfig('enable_awareness_training', !!checked)}
          />
          <Label htmlFor="enable_awareness_training">Enable Awareness Training Redirect</Label>
        </div>
        <p className="text-xs text-gray-600">Redirect users who click on the simulated attack to a security awareness training page</p>
      </CardContent>
    </Card>
  );
};