const availableVariables = [
  { variable: "{SERVER_NAME}", description: "Server name" },
  { variable: "{USER}", description: "Mention the user (@username)" },
  { variable: "{USERNAME}", description: "Username without mention" },
  { variable: "{DISPLAY_NAME}", description: "User's display name" },
  { variable: "{MEMBER_COUNT}", description: "Total member count" },
  { variable: "{USER_COUNT}", description: "User's join position" },
];

export function VariablesHelp() {
  return (
    <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-code text-indigo-400 text-sm"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-100">
            Available Variables
          </h3>
          <p className="text-sm text-neutral-400">
            Use these variables in your welcome messages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableVariables.map(({ variable, description }) => (
          <div
            key={variable}
            className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-colors"
          >
            <code className="bg-neutral-800 px-2 py-1 rounded text-indigo-400 font-mono text-sm font-medium">
              {variable}
            </code>
            <span className="text-neutral-300 text-sm">{description}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
          <p className="text-sm text-blue-300">
            Variables will be automatically replaced with actual values when the
            welcome message is sent.
          </p>
        </div>
      </div>
    </div>
  );
}
