import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Zap, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PipedreamConnectProps {
  appName: string;
  onConnected?: (accountId: string) => void;
}

export const PipedreamConnect = ({ appName, onConnected }: PipedreamConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user, appName]);

  const checkConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('app_name', appName)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      setConnectedAccount(data);
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect integrations",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // In production, this would open Pipedream Connect Link
      // For now, we'll simulate the connection
      const simulatedAccountId = `${appName}_${Date.now()}`;
      
      const { error } = await supabase
        .from('connected_accounts')
        .insert({
          user_id: user.id,
          app_name: appName,
          account_id: simulatedAccountId,
          account_name: `${appName} Account`,
          metadata: {
            connected_via: 'simulation',
            timestamp: new Date().toISOString(),
          }
        });

      if (error) throw error;

      toast({
        title: "Connected!",
        description: `${appName} has been connected successfully.`,
      });

      await checkConnection();
      onConnected?.(simulatedAccountId);
    } catch (error: any) {
      console.error('Error connecting:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect integration",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connectedAccount) return;

    try {
      const { error } = await supabase
        .from('connected_accounts')
        .delete()
        .eq('id', connectedAccount.id);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: `${appName} has been disconnected.`,
      });

      setConnectedAccount(null);
    } catch (error: any) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect integration",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-grey-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking connection...
      </div>
    );
  }

  if (connectedAccount) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-sm font-medium text-green-900">
              {appName} Connected
            </div>
            <div className="text-xs text-green-700">
              {connectedAccount.account_name || 'Account connected'}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-green-700 hover:text-green-900 hover:bg-green-100"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-grey-50 border border-border rounded">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-grey-200 flex items-center justify-center">
          <Zap className="h-4 w-4 text-grey-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">
            Connect {appName}
          </div>
          <div className="text-xs text-grey-500">
            One-click OAuth authentication
          </div>
        </div>
      </div>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        size="sm"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Connect
          </>
        )}
      </Button>
    </div>
  );
};