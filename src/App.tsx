import React, { useState } from 'react';
import { Sidebar, Contact } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Message, askEduChatBot } from './lib/gemini';

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'bot',
    name: 'EduChatBot',
    role: 'Assistente IA',
    isBot: true,
    status: 'online',
    lastMessage: 'Como posso ajudar você hoje?',
    time: 'Agora'
  },
  {
    id: 'g1',
    name: 'Professores - Matemática',
    role: 'Grupo',
    lastMessage: 'João: A pauta da reunião...',
    time: '14:30'
  },
  {
    id: '1',
    name: 'Maria Silva',
    role: 'Coordenadora',
    status: 'online',
    lastMessage: 'Os relatórios foram enviados.',
    time: '12:15'
  },
  {
    id: '2',
    name: 'José Santos',
    role: 'Gestor',
    lastMessage: 'Ok, aprovado.',
    time: 'Ontem'
  }
];

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string>('bot');
  const [isLoading, setIsLoading] = useState(false);
  
  // Store messages per contact ID
  const [messagesStore, setMessagesStore] = useState<Record<string, Message[]>>({
    'bot': [
      {
        id: '1',
        text: 'Olá! Eu sou o EduChatBot, o assistente virtual do EDUCHAT Amazonas. Como posso ajudar nas suas atividades educacionais hoje?',
        isMe: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: true,
      }
    ],
    'g1': [
      {
        id: '101',
        text: 'Boa tarde pessoal! A pauta da reunião já foi definida?',
        isMe: false,
        sender: 'Ana Clara',
        time: '14:20'
      },
      {
        id: '102',
        text: 'Ainda não, estamos aguardando a direção.',
        isMe: true,
        time: '14:25'
      },
      {
        id: '103',
        text: 'A pauta da reunião será sobre o novo plano político pedagógico. Nos vemos às 15h.',
        isMe: false,
        sender: 'João (Diretor)',
        time: '14:30'
      }
    ],
    '1': [
      {
        id: '201',
        text: 'Bom dia! Pode me enviar o planejamento?',
        isMe: false,
        time: '10:00'
      },
      {
        id: '202',
        text: 'Claro, estou enviando por e-mail agora mesmo.',
        isMe: true,
        time: '10:15'
      },
      {
        id: '203',
        text: 'Os relatórios foram enviados.',
        isMe: false,
        time: '12:15'
      }
    ]
  });

  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];
  const currentMessages = messagesStore[selectedContactId] || [];

  const handleSendMessage = async (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isMe: true,
      time
    };

    // Add user message
    setMessagesStore(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));

    // Update contact last message
    setContacts(prev => prev.map(c => 
      c.id === selectedContactId 
        ? { ...c, lastMessage: text.length > 20 ? text.substring(0, 20) + '...' : text, time } 
        : c
    ));

    // If it's the bot, get response
    if (selectedContact.isBot) {
      setIsLoading(true);
      
      try {
        const responseText = await askEduChatBot(text);
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isMe: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
        };

        setMessagesStore(prev => ({
          ...prev,
          [selectedContactId]: [...(prev[selectedContactId] || []), botResponse]
        }));
        
        setContacts(prev => prev.map(c => 
          c.id === selectedContactId 
            ? { ...c, lastMessage: 'Mensagem recebida', time: botResponse.time } 
            : c
        ));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate reply for regular users/groups
      setTimeout(() => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Recebido. Entrarei em contato em breve.',
          isMe: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessagesStore(prev => ({
          ...prev,
          [selectedContactId]: [...(prev[selectedContactId] || []), replyMessage]
        }));
      }, 1500);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <div className="w-full max-w-7xl mx-auto flex shadow-2xl h-full sm:h-[calc(100vh-2rem)] sm:my-4 sm:rounded-2xl overflow-hidden bg-white">
        <Sidebar 
          contacts={contacts} 
          selectedContactId={selectedContactId} 
          onSelectContact={setSelectedContactId} 
        />
        <ChatArea 
          contactName={selectedContact.name}
          contactRole={selectedContact.role}
          isBot={selectedContact.isBot}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
