import React, { useState } from 'react';
import { ShieldCheck, Leaf, Check } from 'lucide-react';
import { InteractiveCubeLogo } from './InteractiveCubeLogo';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#3B1E54] text-white pt-14 pb-12 border-t border-[#4D296D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="relative flex items-center gap-2.5 group cursor-pointer p-1 -ml-1 rounded-2xl w-fit" title="ResourceBox 3D Cube">
              {/* Subtle ambient fading halo background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-[var(--theme-primary)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out blur-xs pointer-events-none" />
              <div className="transition-transform duration-600 ease-out group-hover:scale-[1.03]">
                <InteractiveCubeLogo size="md" />
              </div>
              <span className="relative z-10 text-xl font-bold tracking-tight font-['Plus_Jakarta_Sans'] text-white group-hover:text-[var(--theme-accent-light)] transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_12px_var(--theme-glow)]">
                Resource<span className="text-[var(--theme-accent)] group-hover:text-white transition-colors duration-500">Box</span>
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              A community-powered platform for renting unused equipment and exchanging items with neighbors. Keep resources in active circulation, save money, and cut planetary carbon emissions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4BEE4]">
              <Leaf className="w-3.5 h-3.5" />
              <span>Zero Landfill Mission</span>
            </div>
          </div>

          {/* Column 2: Rent & Share */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
              Resource Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><span className="hover:text-white transition-colors cursor-pointer">Power & Hand Tools</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Cameras, Drones & AV</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Gravel & Cargo Bikes</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Backpacking & Camping Tents</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Home Steam Cleaners</span></li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4BEE4]" />
                <span>Escrow Security Deposits</span>
              </li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Identity Verified Members</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Direct Barter Protections</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Lender Protection Guarantee</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Community Charter</span></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
              Community Hub
            </h4>
            <p className="text-xs text-white/70 mb-3">
              Get notified when members post rare tools or adventure gear.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2 bg-[#3B1E54]/60 rounded-xl text-xs text-[#D4BEE4]">
                <Check className="w-4 h-4" />
                <span>Subscribed! Welcome to ResourceBox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="neighbor@email.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#D4BEE4]"
                />
                <button
                  type="submit"
                  className="py-2 px-3 bg-[#9B7EBD] hover:bg-[#7D5BA6] text-[#3B1E54] rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  Join
                </button>
              </form>
            )}
            <p className="text-[10px] text-white/50 mt-2">
              Ready for .NET Core Web API or PHP backend integration.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 ResourceBox Platform Inc. Designed for conscious community sharing.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Community Charter</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
