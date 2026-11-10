import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Check, 
  CheckCheck, 
  Sparkles, 
  Calendar, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Smile
} from 'lucide-react';
import { ChatConversation, ChatMessage, User, Item } from '../types';
import { AuthActionReason } from './AuthModal';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  conversations: ChatConversation[];
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  onSendMessage: (convId: string, text: string) => void;
  onSelectItem: (itemId: string) => void;
  onOpenAuth: (reason?: AuthActionReason, mode?: 'signin' | 'signup') => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  conversations,
  activeConvId,
  setActiveConvId,
  onSendMessage,
  onSelectItem,
  onOpenAuth,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
        <div className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full z-10 text-center space-y-4 shadow-2xl border border-[#D4BEE4]">
          <div className="w-14 h-14 rounded-2xl bg-[#D4BEE4]/40 text-[#3B1E54] mx-auto flex items-center justify-center shadow-xs">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3B1E54]">Sign In or Sign Up to Chat</h3>
            <p className="text-xs text-[#715F85] mt-1.5 leading-relaxed">
              Users can view items, but must sign in or sign up before messaging other members. Connect your account to chat with owners and negotiate rentals or swaps.
            </p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth('message', 'signin');
              }}
              className="flex-1 py-2.5 rounded-xl border border-[#D4BEE4] hover:border-[#D4BEE4] text-xs font-semibold text-[#3B1E54] hover:bg-[#FAF8FC] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth('message', 'signup');
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#3B1E54] hover:bg-[#2A143D] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Sign Up to Chat
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-[11px] text-[#715F85] hover:underline block mx-auto pt-1"
          >
            Cancel and continue browsing
          </button>
        </div>
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    "Is this available tomorrow morning?",
    "Can we meet at a public park for handover?",
    "Would you accept $35/day for a 4-day rental?",
    "Does it come fully charged?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#D4BEE4] max-w-5xl w-full h-[85vh] z-10 flex overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Left Column: Conversations List */}
        <div className="w-full sm:w-80 md:w-88 border-r border-[#EEF2EF] flex flex-col shrink-0 bg-[#FAF8FC]">
          <div className="p-4 border-b border-[#EEF2EF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B1E54] text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#3B1E54]">Messages</h3>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-[#715F85] hover:text-[#3B1E54]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversations Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EEF2EF]">
            {conversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-white shadow-xs' : 'hover:bg-[#F2F6F3]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.partnerAvatar}
                      alt={conv.partnerName}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-[#D4BEE4]"
                    />
                    {conv.partnerOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#9B7EBD] rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#3B1E54] truncate">
                        {conv.partnerName}
                      </span>
                      <span className="text-[10px] text-[#715F85] shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-[#3B1E54] truncate mb-0.5">
                      {conv.itemTitle}
                    </p>

                    <p className="text-xs text-[#715F85] truncate">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#3B1E54] shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation Pane */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Conversation Header */}
            <div className="px-6 py-3.5 border-b border-[#EEF2EF] flex items-center justify-between bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.partnerAvatar}
                  alt={activeConv.partnerName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[#D4BEE4]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#3B1E54]">{activeConv.partnerName}</h4>
                    <span className="text-[11px] text-[#3B1E54] font-semibold bg-[#D4BEE4]/40 px-2 py-0.5 rounded-full">
                      ★ {activeConv.partnerRating}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#715F85]">
                    {activeConv.partnerOnline ? 'Active now' : 'Seen recently'}
                  </div>
                </div>
              </div>

              {/* Item pill callout */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectItem(activeConv.itemId)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8FC] border border-[#D4BEE4] hover:border-[#3B1E54] text-xs font-semibold text-[#3B1E54] transition-colors"
                >
                  <img src={activeConv.itemImage} alt="" className="w-5 h-5 rounded object-cover" />
                  <span className="max-w-[140px] truncate">{activeConv.itemTitle}</span>
                  <ExternalLink className="w-3 h-3 text-[#715F85]" />
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-[#715F85] hover:text-[#3B1E54] hover:bg-[#FAF8FC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Negotiation terms bar */}
            <div className="bg-[#F8FAF8] px-6 py-2 border-b border-[#EEF2EF] flex items-center justify-between text-xs text-[#715F85]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B1E54]" />
                <span>
                  Subject: <strong className="text-[#3B1E54]">{activeConv.itemTitle}</strong> (${activeConv.itemDailyPrice}/day)
                </span>
              </div>
              <span className="text-[11px] text-[#3B1E54] font-semibold hidden sm:inline">
                Community Escrow Protected
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-[#FAF8FC]">
              {activeConv.messages && activeConv.messages.length > 0 ? (
                activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <img
                          src={msg.senderAvatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      )}

                      <div className="max-w-md space-y-1">
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#3B1E54] text-white rounded-br-xs'
                              : 'bg-white border border-[#D4BEE4] text-[#3B1E54] rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className={`text-[10px] text-[#715F85] px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty message state inside DM */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3.5 my-auto">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4BEE4]/40 text-[#3B1E54] flex items-center justify-center shadow-xs">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="max-w-sm space-y-1">
                    <h5 className="text-base font-bold text-[#3B1E54]">No messages in this chat yet</h5>
                    <p className="text-xs text-[#715F85] leading-relaxed">
                      Say hello to <strong className="text-[#3B1E54]">{activeConv.partnerName}</strong> to coordinate equipment pickup, discuss rental availability, or agree on swap terms.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-md">
                    {[
                      'Hi! Is this item still available?',
                      'When is a good time for pickup?',
                      'Can I rent this for the upcoming weekend?',
                    ].map((starter, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInputText(starter)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#D4BEE4] hover:border-[#3B1E54] hover:bg-[#FAF8FC] text-xs font-medium text-[#3B1E54] transition-colors shadow-2xs cursor-pointer"
                      >
                        "{starter}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-[#EEF2EF] bg-white flex gap-1.5 overflow-x-auto">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(prompt)}
                  className="px-2.5 py-1 text-[11px] bg-[#FAF8FC] hover:bg-[#E9EFEA] text-[#715F85] rounded-lg whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#EEF2EF] bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message or discuss pickup arrangements..."
                className="flex-1 px-4 py-2.5 text-xs bg-[#FAF8FC] border border-[#D4BEE4] rounded-xl text-[#3B1E54] placeholder-[#715F85] focus:outline-none focus:border-[#3B1E54]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="py-2.5 px-4 bg-[#3B1E54] hover:bg-[#2A143D] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#FAF8FC]">
            <div className="w-14 h-14 rounded-2xl bg-[#D4BEE4]/40 text-[#3B1E54] flex items-center justify-center shadow-xs">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#3B1E54]">No conversation selected</h4>
            <p className="text-xs text-[#715F85] max-w-sm">
              Browse items in the marketplace and tap <strong>"Direct Message"</strong> to coordinate equipment rentals or propose swaps with neighbors.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
