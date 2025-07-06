import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Server, 
  Wifi, 
  Router, 
  Eye, 
  Search,
  Globe,
  Shield,
  Activity,
  MapPin,
  Zap,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const NetworkDiscovery = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const [discoveredHosts] = useState([
    {
      ip: "192.168.1.1",
      hostname: "router.local",
      mac: "00:11:22:33:44:55",
      manufacturer: "Cisco Systems",
      openPorts: [22, 80, 443],
      services: ["SSH", "HTTP", "HTTPS"],
      osGuess: "Linux 2.6.x",
      status: "up"
    },
    {
      ip: "192.168.1.10",
      hostname: "server01.local",
      mac: "AA:BB:CC:DD:EE:FF",
      manufacturer: "Dell Inc.",
      openPorts: [21, 22, 80, 3389],
      services: ["FTP", "SSH", "HTTP", "RDP"],
      osGuess: "Windows Server 2019",
      status: "up"
    },
    {
      ip: "192.168.1.25",
      hostname: "printer.local",
      mac: "11:22:33:44:55:66",
      manufacturer: "HP Inc.",
      openPorts: [80, 443, 9100],
      services: ["HTTP", "HTTPS", "Print"],
      osGuess: "Linux 3.x",
      status: "up"
    }
  ]);

  const handleNetworkScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast.success("Network discovery completed!");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getServiceColor = (service: string) => {
    const colors: Record<string, string> = {
      'SSH': 'bg-blue-100 text-blue-800',
      'HTTP': 'bg-green-100 text-green-800',
      'HTTPS': 'bg-emerald-100 text-emerald-800',
      'FTP': 'bg-orange-100 text-orange-800',
      'RDP': 'bg-red-100 text-red-800',
      'Print': 'bg-purple-100 text-purple-800'
    };
    return colors[service] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Network className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Network Discovery
              </h1>
              <p className="text-gray-600 text-lg">
                Discover and analyze network infrastructure and connected devices
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="discovery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Host Discovery
            </TabsTrigger>
            <TabsTrigger value="topology" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Network Topology
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-6">
            {/* Scan Control */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Network Scan Configuration
                </CardTitle>
                <CardDescription>Configure and initiate network discovery scans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Network</label>
                    <Input 
                      placeholder="192.168.1.0/24" 
                      defaultValue="192.168.1.0/24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scan Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Ping Sweep</option>
                      <option>TCP SYN Scan</option>
                      <option>UDP Scan</option>
                      <option>Comprehensive Scan</option>
                    </select>
                  </div>
                </div>
                
                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Scanning network...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                )}
                
                <Button 
                  onClick={handleNetworkScan}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isScanning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Network Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Discovered Hosts */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-600" />
                  Discovered Hosts ({discoveredHosts.length})
                </CardTitle>
                <CardDescription>Live network devices and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discoveredHosts.map((host, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Server className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{host.ip}</h3>
                            <p className="text-sm text-gray-600">{host.hostname}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {host.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">MAC Address:</span>
                          <p className="font-mono text-gray-900">{host.mac}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Manufacturer:</span>
                          <p className="text-gray-900">{host.manufacturer}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">OS Guess:</span>
                          <p className="text-gray-900">{host.osGuess}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Open Ports:</span>
                          <p className="font-mono text-gray-900">{host.openPorts.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="font-medium text-gray-700 block mb-2">Services:</span>
                        <div className="flex flex-wrap gap-2">
                          {host.services.map((service, serviceIndex) => (
                            <Badge key={serviceIndex} className={getServiceColor(service)}>
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topology" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Network Topology Map
                </CardTitle>
                <CardDescription>Visual representation of network infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Network topology visualization</p>
                    <p className="text-sm text-gray-400">Interactive network map will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  Live Network Monitoring
                </CardTitle>
                <CardDescription>Real-time network traffic and device status monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Live monitoring dashboard</p>
                    <p className="text-sm text-gray-400">Real-time network metrics and alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NetworkDiscovery;