import { CodeBracketIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface DocEndpointProps {
  endpoint: string;
  method: string;
  implementationFile: string;
  description?: string;
  docsUrl?: string; // Optional docs URL
}

export const DocEndpoint = ({ endpoint, method, implementationFile, description, docsUrl }: DocEndpointProps) => {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'POST':
        return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
      case 'PUT':
        return 'bg-amber-600/20 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-600/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="relative mt-2 backdrop-blur-sm backdrop-filter">
      <div className="p-2.5 bg-gray-900/90 rounded-lg border border-gray-800 shadow-lg text-xs">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getMethodColor(method)}`}>
                {method}
              </span>
              <code className="px-2 py-0.5 bg-gray-800/50 rounded text-blue-300 font-mono">
                {endpoint}
              </code>
            </div>
            {docsUrl && (
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-800 rounded transition-colors"
                title="View Documentation"
              >
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 text-gray-400 hover:text-gray-300" />
              </a>
            )}
          </div>

          {description && (
            <div className="text-gray-300 text-[11px] leading-tight pl-2 border-l-2 border-gray-700">
              {description}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <CodeBracketIcon className="h-3 w-3 text-gray-500" />
            <code className="text-fuchsia-300/90 font-mono">
              {implementationFile}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}; 