import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Bug, 
  Globe, 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Search,
  Camera,
  RefreshCw,
  FileCode2,
  Workflow
} from 'lucide-react';

interface PlaywrightSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaywrightSkillsModal: React.FC<PlaywrightSkillsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cli' | 'triage' | 'testSuite'>('cli');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Test Runner Simulation State
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [testProgress, setTestProgress] = useState<number>(0);
  const [activeTestIndex, setActiveTestIndex] = useState<number>(-1);

  const testCases = [
    { id: 1, name: 'Hero luxury typography & header branding', target: 'HeroSection.tsx', status: 'pass' },
    { id: 2, name: 'Mochi 2D kitty login speech bubble & reactive paw coverage', target: 'AuthModal3DScene.tsx', status: 'pass' },
    { id: 3, name: 'Footer peeping orange cat scroll-arrival trigger', target: 'PeepingOrangeCat.tsx', status: 'pass' },
    { id: 4, name: 'Lottie cat-in-box 404, network & upload error states', target: 'CatInBoxErrorState.tsx', status: 'pass' },
    { id: 5, name: 'Search bar & category filters live synchronization', target: 'TopSearchBar.tsx', status: 'pass' },
  ];

  const handleRunTests = () => {
    setTestStatus('running');
    setTestProgress(0);
    setActiveTestIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setActiveTestIndex(current);
      setTestProgress(Math.min(100, Math.round((current / testCases.length) * 100)));

      if (current >= testCases.length) {
        clearInterval(interval);
        setTestStatus('completed');
      }
    }, 600);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const cliSnippets = [
    { title: 'Open & Navigate', cmd: 'playwright-cli open https://resourcebox.app\nplaywright-cli snapshot' },
    { title: 'Interact with Mochi Login Modal', cmd: 'playwright-cli click "button:has-text(\'Sign In\')"\nplaywright-cli fill "#email" "user@example.com"\nplaywright-cli snapshot' },
    { title: 'Scroll & Trigger Peeping Cat', cmd: 'playwright-cli mousewheel 0 800\nplaywright-cli find "Orange Cat Peeping"' },
    { title: 'Evaluate DOM & Capture Screenshot', cmd: 'playwright-cli eval "document.title"\nplaywright-cli screenshot --filename=footer-cat.png' },
    { title: 'Test State & Session Storage', cmd: 'playwright-cli state-save auth.json\nplaywright-cli localstorage-get resourcebox_local_user' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#040C08]/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] border border-[#3B1E54]/25 max-w-4xl w-full z-10 overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#3B1E54] text-white flex items-center justify-between border-b border-[#4D296D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-['Lexend'] tracking-tight">
                  Playwright Automation Skills
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Integrated
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                skills/playwright-cli · skills/playwright-triage · automated E2E testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-3 bg-[#FAF8FC] border-b border-[#E8E2D8] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'cli'
                ? 'border-[#3B1E54] text-[#3B1E54]'
                : 'border-transparent text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>playwright-cli</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'triage'
                ? 'border-[#3B1E54] text-[#3B1E54]'
                : 'border-transparent text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>playwright-triage</span>
          </button>

          <button
            onClick={() => setActiveTab('testSuite')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'testSuite'
                ? 'border-[#3B1E54] text-[#3B1E54]'
                : 'border-transparent text-[#715F85] hover:text-[#3B1E54]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>ResourceBox E2E Tests</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* TAB 1: playwright-cli */}
          {activeTab === 'cli' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4]/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileCode2 className="w-4 h-4 text-[#3B1E54]" />
                  <span className="text-xs font-bold text-[#3B1E54] font-['Lexend']">
                    Skill Definition: skills/playwright-cli/SKILL.md
                  </span>
                </div>
                <p className="text-xs text-[#5C4B6E] leading-relaxed">
                  Allows autonomous browser automation, web page snapshotting, DOM element inspection, interaction via refs (<code className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] text-[#3B1E54]">click e15</code>), form submission, cookie/storage control, and video/screenshot generation.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#D4BEE4] text-[10px] font-mono text-[#3B1E54]">
                    allowed-tools: Bash(playwright-cli:*)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#D4BEE4] text-[10px] font-mono text-[#3B1E54]">
                    Bash(npx playwright:*)
                  </span>
                </div>
              </div>

              {/* Quick Command Recipes */}
              <div>
                <h4 className="text-xs font-bold text-[#3B1E54] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#9B7EBD]" />
                  <span>Key Automation Recipes for ResourceBox</span>
                </h4>
                <div className="space-y-3">
                  {cliSnippets.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#1A1024] text-white border border-[#3B1E54]/40">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#D4BEE4] mb-1.5">
                        <span>{item.title}</span>
                        <button
                          onClick={() => handleCopy(item.cmd, idx)}
                          className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {item.cmd}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: playwright-triage */}
          {activeTab === 'triage' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4]/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <Bug className="w-4 h-4 text-[#3B1E54]" />
                  <span className="text-xs font-bold text-[#3B1E54] font-['Lexend']">
                    Skill Definition: skills/playwright-triage/SKILL.md
                  </span>
                </div>
                <p className="text-xs text-[#5C4B6E] leading-relaxed">
                  Triage and fix upstream issues in <code className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] text-[#3B1E54]">microsoft/playwright-cli</code>, bisect published versions, check gitHead commits, and run reproduction tests in <code className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] text-[#3B1E54]">tests/mcp/cli-*.spec.ts</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[#E8E2D8] bg-white">
                  <h5 className="text-xs font-bold text-[#3B1E54] mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#9B7EBD]" />
                    <span>Tip-of-Tree Reproduction</span>
                  </h5>
                  <p className="text-[11px] text-[#715F85] leading-relaxed mb-2">
                    Reproduce in a checkout of <code className="text-[#3B1E54] font-mono">microsoft/playwright</code> at the tip of main using its <code className="text-[#3B1E54] font-mono">cli</code> fixture:
                  </p>
                  <pre className="p-2 rounded-xl bg-[#1A1024] text-emerald-300 text-[10px] font-mono overflow-x-auto">
                    npm run test-playwright-cli
                  </pre>
                </div>

                <div className="p-4 rounded-2xl border border-[#E8E2D8] bg-white">
                  <h5 className="text-xs font-bold text-[#3B1E54] mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#9B7EBD]" />
                    <span>Published Version Bisecting</span>
                  </h5>
                  <p className="text-[11px] text-[#715F85] leading-relaxed mb-2">
                    Test against any specific published npm version cleanly:
                  </p>
                  <pre className="p-2 rounded-xl bg-[#1A1024] text-emerald-300 text-[10px] font-mono overflow-x-auto">
                    npm i @playwright/cli@0.1.0-alpha.123{'\n'}npx playwright-cli --help
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ResourceBox E2E Tests */}
          {activeTab === 'testSuite' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#FAF8FC] border border-[#D4BEE4]/60 gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#3B1E54] font-['Lexend']">
                    Playwright E2E Suite: tests/resourcebox.spec.ts
                  </h4>
                  <p className="text-xs text-[#5C4B6E] mt-0.5">
                    Automated tests for Mochi cat login, peeping cat footer, and error states.
                  </p>
                </div>

                <button
                  onClick={handleRunTests}
                  disabled={testStatus === 'running'}
                  className="px-4 py-2 bg-[#3B1E54] hover:bg-[#2A143D] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {testStatus === 'running' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{testStatus === 'running' ? 'Running Tests...' : 'Run Playwright Tests'}</span>
                </button>
              </div>

              {/* Progress bar during test run */}
              {testStatus !== 'idle' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#3B1E54]">
                    <span>Test Progress</span>
                    <span>{testProgress}% ({Math.min(activeTestIndex + 1, testCases.length)}/{testCases.length})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E8E2D8] overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${testProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Test Cases List */}
              <div className="space-y-2.5">
                {testCases.map((tc, idx) => {
                  const isDone = testStatus === 'completed' || (testStatus === 'running' && idx <= activeTestIndex);
                  const isRunningNow = testStatus === 'running' && idx === activeTestIndex;

                  return (
                    <div
                      key={tc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isRunningNow
                          ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                          : isDone
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-[#E8E2D8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isRunningNow ? (
                          <RefreshCw className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                        ) : isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[#D4BEE4] shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-[#3B1E54]">{tc.name}</p>
                          <p className="text-[10px] text-[#715F85] font-mono">{tc.target}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isRunningNow
                            ? 'bg-amber-100 text-amber-800'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isRunningNow ? 'Running...' : isDone ? 'PASSED' : 'Queued'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAF8FC] border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#715F85]">
          <span className="font-mono text-[11px]">playwright.config.ts · tests/resourcebox.spec.ts</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3B1E54] hover:bg-[#2A143D] text-white font-bold rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
