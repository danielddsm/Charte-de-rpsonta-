import React from 'react';
import { Search, UserCircle, Bot, Users } from 'lucide-react';

export type Contact = {
  id: string;
  name: string;
  role: string;
  isBot?: boolean;
  status?: string;
  lastMessage?: string;
  time?: string;
};

interface SidebarProps {
  contacts: Contact[];
  selectedContactId: string;
  onSelectContact: (id: string) => void;
}

export function Sidebar({ contacts, selectedContactId, onSelectContact }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 bg-[#003399] text-white flex items-center gap-3">
        <UserCircle size={40} className="text-[#D4AF37]" />
        <div>
          <h2 className="font-bold text-lg leading-tight">EDUCHAT</h2>
          <p className="text-xs text-blue-200">Amazonas</p>
        </div>
      </div>
      
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003399]"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map(contact => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
              selectedContactId === contact.id ? 'bg-blue-50 border-l-4 border-l-[#003399]' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="relative">
              {contact.isBot ? (
                <div className="w-12 h-12 rounded-full bg-[#003399] flex items-center justify-center text-[#D4AF37]">
                  <Bot size={24} />
                </div>
              ) : contact.role === 'Grupo' ? (
                <div className="w-12 h-12 rounded-full bg-[#003399]/10 flex items-center justify-center text-[#003399]">
                  <Users size={24} />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <UserCircle size={32} />
                </div>
              )}
              {contact.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                {contact.time && <span className="text-xs text-gray-500">{contact.time}</span>}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {contact.isBot ? 'Assistente IA' : contact.lastMessage || contact.role}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
