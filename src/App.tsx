/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ChatInterface from './components/ChatInterface';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white">
      <ChatInterface />
    </div>
  );
}
