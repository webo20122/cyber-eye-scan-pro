
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail } from "lucide-react";

interface MailServerConfigProps {
  mailParams: {
    check_smtp: boolean;
    check_pop3: boolean;
    check_imap: boolean;
    smtp_port: string;
    pop3_port: string;
    imap_port: string;
  };
  setMailParams: (params: any) => void;
}

export const MailServerConfig = ({ mailParams, setMailParams }: MailServerConfigProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Mail Server Check Parameters
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkSMTP"
              checked={mailParams.check_smtp}
              onCheckedChange={(checked) =>
                setMailParams(prev => ({ ...prev, check_smtp: !!checked }))
              }
            />
            <Label htmlFor="checkSMTP">SMTP</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkPOP3"
              checked={mailParams.check_pop3}
              onCheckedChange={(checked) =>
                setMailParams(prev => ({ ...prev, check_pop3: !!checked }))
              }
            />
            <Label htmlFor="checkPOP3">POP3</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkIMAP"
              checked={mailParams.check_imap}
              onCheckedChange={(checked) =>
                setMailParams(prev => ({ ...prev, check_imap: !!checked }))
              }
            />
            <Label htmlFor="checkIMAP">IMAP</Label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="smtpPorts">SMTP Ports</Label>
            <Input
              id="smtpPorts"
              value={mailParams.smtp_port}
              onChange={(e) => setMailParams(prev => ({ ...prev, smtp_port: e.target.value }))}
              placeholder="25,587"
            />
          </div>
          <div>
            <Label htmlFor="pop3Ports">POP3 Ports</Label>
            <Input
              id="pop3Ports"
              value={mailParams.pop3_port}
              onChange={(e) => setMailParams(prev => ({ ...prev, pop3_port: e.target.value }))}
              placeholder="110,995"
            />
          </div>
          <div>
            <Label htmlFor="imapPorts">IMAP Ports</Label>
            <Input
              id="imapPorts"
              value={mailParams.imap_port}
              onChange={(e) => setMailParams(prev => ({ ...prev, imap_port: e.target.value }))}
              placeholder="143,993"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
