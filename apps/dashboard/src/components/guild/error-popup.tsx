import { Button } from "@/components/button";
import React from "react";

interface ErrorPopupProps {
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
  onGoHome: () => void;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  error,
  onRetry,
  isRetrying,
  onGoHome,
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-neutral-900/70 backdrop-blur-md rounded-xl border border-neutral-800 p-6 text-center">
        <div className="text-red-400 text-2xl font-semibold flex items-center justify-center gap-3 mb-6">
          <i className="fas fa-exclamation-circle"></i>
          <span>Unable to Load Servers</span>
        </div>

        <div className="text-neutral-300 mb-6">
          <p>
            We encountered an issue while trying to load your Discord servers.
          </p>
        </div>

        <div className="bg-neutral-800/50 rounded-lg p-5 mb-8">
          <h3 className="text-lg font-medium text-neutral-200 mb-4 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-400"></i>
            <span>Troubleshooting Steps</span>
          </h3>

          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <i className="fas fa-sync-alt text-indigo-400 mt-1"></i>
              <span className="text-neutral-300">
                Try refreshing the page or clicking the button below.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fas fa-sign-out-alt text-indigo-400 mt-1"></i>
              <span className="text-neutral-300">
                Sign out and sign back in to refresh your Discord authorization.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fas fa-clock text-indigo-400 mt-1"></i>
              <span className="text-neutral-300">
                Wait a few minutes if you&apos;re experiencing rate limiting
                from Discord.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fas fa-check-circle text-indigo-400 mt-1"></i>
              <span className="text-neutral-300">
                Verify that you have administrator permissions in your Discord
                servers.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onRetry}
            variant="primary"
            icon="fas fa-sync-alt"
            iconPosition="left"
            loading={isRetrying}
          >
            Try Again
          </Button>

          <Button
            onClick={onGoHome}
            variant="glass"
            icon="fas fa-home"
            iconPosition="left"
          >
            Return to Home
          </Button>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-800">
          <details className="text-left">
            <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-400 transition-colors">
              Error Details (for debugging)
            </summary>
            <div className="mt-2 p-3 bg-neutral-800/70 rounded text-xs font-mono text-red-300 overflow-x-auto">
              {error}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
