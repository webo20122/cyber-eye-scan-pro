
export const DemoCredentials = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-600 space-y-3">
        <p className="font-semibold text-center text-gray-800">Demo Credentials</p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg space-y-2 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Administrator:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">admin@cyberscan.com</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Password:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">admin123</code>
          </div>
          <hr className="my-2 border-gray-200" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Security Analyst:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">user@cyberscan.com</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Password:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">user123</code>
          </div>
        </div>
      </div>
    </div>
  );
};
