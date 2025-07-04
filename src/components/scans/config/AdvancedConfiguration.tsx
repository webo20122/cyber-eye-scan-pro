
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkScanConfig } from "./NetworkScanConfig";
import { WebApplicationScanConfig } from "./WebApplicationScanConfig";
import { SastScanConfig } from "./SastScanConfig";
import { CredentialsLeakConfig } from "./CredentialsLeakConfig";
import { DatabaseEnumConfig } from "./DatabaseEnumConfig";
import { PassiveReconConfig } from "./PassiveReconConfig";
import { SshSecurityConfig } from "./SshSecurityConfig";
import { MailServerConfig } from "./MailServerConfig";
import { ShodanLookupConfig } from "./ShodanLookupConfig";

interface ScanModules {
  enable_network_scan: boolean;
  enable_web_application_scan: boolean;
  enable_credentials_leak: boolean;
  enable_database_enum_check: boolean;
  enable_sast_scan: boolean;
  enable_vulnerability_check: boolean;
  enable_passive_recon: boolean;
  enable_ssh_security_check: boolean;
  enable_mail_server_check: boolean;
  enable_shodan_lookup: boolean;
}

interface AdvancedConfigurationProps {
  scanModules: ScanModules;
  networkParams: any;
  setNetworkParams: (params: any) => void;
  webParams: any;
  setWebParams: (params: any) => void;
  sastParams: any;
  setSastParams: (params: any) => void;
  credentialsParams: any;
  setCredentialsParams: (params: any) => void;
  databaseParams: any;
  setDatabaseParams: (params: any) => void;
  passiveReconParams: any;
  setPassiveReconParams: (params: any) => void;
  sshParams: any;
  setSshParams: (params: any) => void;
  mailParams: any;
  setMailParams: (params: any) => void;
  shodanParams: any;
  setShodanParams: (params: any) => void;
}

export const AdvancedConfiguration = ({
  scanModules,
  networkParams,
  setNetworkParams,
  webParams,
  setWebParams,
  sastParams,
  setSastParams,
  credentialsParams,
  setCredentialsParams,
  databaseParams,
  setDatabaseParams,
  passiveReconParams,
  setPassiveReconParams,
  sshParams,
  setSshParams,
  mailParams,
  setMailParams,
  shodanParams,
  setShodanParams
}: AdvancedConfigurationProps) => {
  if (!Object.values(scanModules).some(Boolean)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Advanced Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {scanModules.enable_network_scan && (
          <NetworkScanConfig 
            networkParams={networkParams}
            setNetworkParams={setNetworkParams}
          />
        )}

        {scanModules.enable_web_application_scan && (
          <WebApplicationScanConfig 
            webParams={webParams}
            setWebParams={setWebParams}
          />
        )}

        {scanModules.enable_sast_scan && (
          <SastScanConfig 
            sastParams={sastParams}
            setSastParams={setSastParams}
          />
        )}

        {scanModules.enable_credentials_leak && (
          <CredentialsLeakConfig 
            credentialsParams={credentialsParams}
            setCredentialsParams={setCredentialsParams}
          />
        )}

        {scanModules.enable_database_enum_check && (
          <DatabaseEnumConfig 
            databaseParams={databaseParams}
            setDatabaseParams={setDatabaseParams}
          />
        )}

        {scanModules.enable_passive_recon && (
          <PassiveReconConfig 
            passiveReconParams={passiveReconParams}
            setPassiveReconParams={setPassiveReconParams}
          />
        )}

        {scanModules.enable_ssh_security_check && (
          <SshSecurityConfig 
            sshParams={sshParams}
            setSshParams={setSshParams}
          />
        )}

        {scanModules.enable_mail_server_check && (
          <MailServerConfig 
            mailParams={mailParams}
            setMailParams={setMailParams}
          />
        )}

        {scanModules.enable_shodan_lookup && (
          <ShodanLookupConfig 
            shodanParams={shodanParams}
            setShodanParams={setShodanParams}
          />
        )}
      </CardContent>
    </Card>
  );
};
