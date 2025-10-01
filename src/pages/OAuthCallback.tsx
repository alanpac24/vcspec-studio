import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');

        if (error) {
          // Send error to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'pipedream_oauth_error',
              error: error
            }, window.location.origin);
          }
          return;
        }

        if (!code || !state) {
          throw new Error('Missing OAuth parameters');
        }

        // Decode state
        const stateData = JSON.parse(atob(state));
        const { user_id, app_name } = stateData;

        // Exchange code for tokens via edge function
        const { data, error: exchangeError } = await supabase.functions.invoke('pipedream-oauth-exchange', {
          body: { code, app_name, user_id }
        });

        if (exchangeError) throw exchangeError;

        // Send success message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'pipedream_oauth_success',
            account_id: data.account_id,
            account_name: data.account_name,
            metadata: data.metadata
          }, window.location.origin);
          
          // Close popup
          window.close();
        } else {
          // Redirect if not in popup
          navigate('/');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        if (window.opener) {
          window.opener.postMessage({
            type: 'pipedream_oauth_error',
            error: error.message
          }, window.location.origin);
        }
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-foreground">Completing connection...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
