import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';
import UserBadge from '../components/UserBadge';
import {
  Send,
  ArrowLeft,
  Search,
  MessageSquare,
  Calendar,
  Clock,
  User,
  MoreVertical,
  Paperclip,
  Phone,
  Video,
  Star,
  Building,
  CheckCircle,
  Circle,
  Loader2
} from 'lucide-react';

interface Message {
  id: number;
  sender: number;
  recipient: number;
  sender_name: string;
  recipient_name: string;
  event: number;
  event_title: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  event_id: number;
  event_title: string;
  participant_name: string;
  participant_username?: string;
  participant_email: string;
  participant_type: 'speaker' | 'host';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  event_date: string;
  event_status: string;
}

interface Event {
  id: number;
  title: string;
  event_date: string;
  status: string;
  speaker_name: string;
}

const HostMessaging: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState(false);

  // Fetch events and messages from backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/host-login');
        return;
      }

      try {
        setLoading(true);

        // Fetch all events for the host
        const eventsResponse = await fetch(ENDPOINTS.EVENTS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (eventsResponse.ok) {
          const events = await eventsResponse.json();

          // Group events by speaker to create conversations
          const conversationsMap = new Map<number, Conversation>();

          for (const event of events) {
            if (!conversationsMap.has(event.speaker)) {
              conversationsMap.set(event.speaker, {
                id: event.speaker,
                event_id: event.id,
                event_title: event.title,
                participant_name: event.speaker_name,
                participant_email: '',
                participant_type: 'speaker',
                last_message: '',
                last_message_time: event.created_at,
                unread_count: 0,
                event_date: event.event_date,
                event_status: event.status
              });
            }
          }

          setConversations(Array.from(conversationsMap.values()));
        }

        // If a conversation is selected, fetch its messages
        if (conversationId) {
          const messagesResponse = await fetch(`${ENDPOINTS.MESSAGES}?event_id=${conversationId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setMessages(messagesData);

            // Update selected conversation
            const conversation = conversations.find(c => c.id === parseInt(conversationId));
            if (conversation) {
              setSelectedConversation(conversation);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, navigate]);

  // Backup mock data for now
  useEffect(() => {
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: 1,
          event_id: 1,
          event_title: "AI in Healthcare: Future Perspectives",
          participant_name: "Dr. Sarah Johnson",
          participant_email: "sarah.johnson@medical.com",
          participant_type: 'speaker',
          last_message: "Looking forward to discussing the technical requirements for the presentation.",
          last_message_time: "2024-09-07T10:30:00Z",
          unread_count: 2,
          event_date: "2024-09-15T14:00:00Z",
          event_status: "confirmed"
        },
        {
          id: 2,
          event_id: 2,
          event_title: "Medical Innovation Seminar",
          participant_name: "Dr. Michael Chen",
          participant_email: "m.chen@innovation.org",
          participant_type: 'speaker',
          last_message: "Thank you for accepting the speaking opportunity. I'll send the event details shortly.",
          last_message_time: "2024-09-06T16:45:00Z",
          unread_count: 0,
          event_date: "2024-09-22T10:00:00Z",
          event_status: "accepted"
        },
        {
          id: 3,
          event_id: 3,
          event_title: "Digital Health Transformation Workshop",
          participant_name: "Dr. Emily Rodriguez",
          participant_email: "e.rodriguez@digitalhealth.com",
          participant_type: 'speaker',
          last_message: "Could we schedule a brief call to discuss the workshop format?",
          last_message_time: "2024-09-05T14:20:00Z",
          unread_count: 1,
          event_date: "2024-09-28T13:00:00Z",
          event_status: "pending"
        }
      ];
      
      setConversations(mockConversations);
      
      if (conversationId) {
        const conversation = mockConversations.find(c => c.id === parseInt(conversationId));
        if (conversation) {
          setSelectedConversation(conversation);
          
          // Mock messages for selected conversation
          const mockMessages: Message[] = [
            {
              id: 1,
              sender: 1,
              recipient: 2,
              sender_name: "Tech Summit Organizer",
              recipient_name: "Dr. Sarah Johnson",
              event: 1,
              event_title: "AI in Healthcare: Future Perspectives",
              subject: "Speaking Opportunity - AI in Healthcare",
              body: "Dear Dr. Johnson, we would love to have you speak at our upcoming Tech Summit about AI applications in healthcare. The event is scheduled for September 15th.",
              is_read: true,
              created_at: "2024-09-01T09:00:00Z"
            },
            {
              id: 2,
              sender: 2,
              recipient: 1,
              sender_name: "Dr. Sarah Johnson",
              recipient_name: "Tech Summit Organizer",
              event: 1,
              event_title: "AI in Healthcare: Future Perspectives",
              subject: "Re: Speaking Opportunity - AI in Healthcare",
              body: "Thank you for the invitation! I'm very interested in participating. Could you provide more details about the expected audience and technical setup?",
              is_read: true,
              created_at: "2024-09-01T14:30:00Z"
            },
            {
              id: 3,
              sender: 1,
              recipient: 2,
              sender_name: "Tech Summit Organizer",
              recipient_name: "Dr. Sarah Johnson",
              event: 1,
              event_title: "AI in Healthcare: Future Perspectives",
              subject: "Event Details and Requirements",
              body: "Great to hear from you! The audience will consist of about 500 healthcare professionals and tech leaders. We'll provide wireless microphone, presentation clicker, and stage lighting. The talk should be 45 minutes including Q&A.",
              is_read: true,
              created_at: "2024-09-02T11:15:00Z"
            },
            {
              id: 4,
              sender: 2,
              recipient: 1,
              sender_name: "Dr. Sarah Johnson",
              recipient_name: "Tech Summit Organizer",
              event: 1,
              event_title: "AI in Healthcare: Future Perspectives",
              subject: "Re: Event Details and Requirements",
              body: "Perfect! That sounds exactly like what I was hoping for. I'll prepare a comprehensive presentation covering current AI applications and future trends in healthcare. Looking forward to discussing the technical requirements for the presentation.",
              is_read: false,
              created_at: "2024-09-07T10:30:00Z"
            }
          ];
          
          setMessages(mockMessages);
        }
      }
      
      setLoading(false);
    }, 1000);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conversation.participant_username && conversation.participant_username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Get current user ID from token or localStorage
      const userDataString = localStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      const payload = {
        event: selectedConversation.event_id,
        recipient: selectedConversation.id, // speaker ID
        subject: `Re: ${selectedConversation.event_title}`,
        body: newMessage
      };

      const response = await fetch(ENDPOINTS.MESSAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');

      // Update conversation last message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: newMessage, last_message_time: new Date().toISOString() }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 7 * 24) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-white text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/host/dashboard')}
              className="flex items-center text-gray-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-black text-black">Messages</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, username, or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-[#27465C]' : ''
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      navigate(`/host/messages/${conversation.id}`);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#27465C] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-black truncate">{conversation.participant_name}</h3>
                            <UserBadge userType={conversation.participant_type} />
                          </div>
                          {conversation.participant_username && (
                            <p className="text-xs text-gray-500">@{conversation.participant_username}</p>
                          )}
                          <p className="text-sm text-gray-600 truncate">{conversation.event_title}</p>
                        </div>
                      </div>
                      {conversation.unread_count > 0 && (
                        <div className="bg-[#27465C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-2">{conversation.last_message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatTime(conversation.last_message_time)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(conversation.event_status)}`}>
                        {conversation.event_status}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? "No conversations match your search." : "Start a conversation by booking a speaker."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#27465C] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-black">{selectedConversation.participant_name}</h3>
                            <UserBadge userType={selectedConversation.participant_type} />
                          </div>
                          {selectedConversation.participant_username && (
                            <p className="text-xs text-gray-500">@{selectedConversation.participant_username}</p>
                          )}
                          <p className="text-sm text-gray-600">{selectedConversation.event_title}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowEventInfo(!showEventInfo)}
                          className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg"
                          title="Event Info"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg" title="Call">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg" title="Video Call">
                          <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Event Info Panel */}
                    {showEventInfo && (
                      <div className="mt-4 p-3 bg-white rounded-lg border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Event Date:</span>
                            <div className="flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              {new Date(selectedConversation.event_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedConversation.event_status)}`}>
                              {selectedConversation.event_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender_name === "Tech Summit Organizer";
                      const showAvatar = index === 0 || messages[index - 1].sender_name !== message.sender_name;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                            {!isCurrentUser && showAvatar && (
                              <div className="w-8 h-8 bg-[#27465C] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {!isCurrentUser && !showAvatar && <div className="w-8"></div>}
                            
                            <div className={`rounded-lg px-4 py-2 ${
                              isCurrentUser 
                                ? 'bg-[#27465C] text-white' 
                                : 'bg-gray-100 text-black'
                            }`}>
                              <p className="text-sm">{message.body}</p>
                              <div className={`flex items-center justify-between mt-1 text-xs ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                <span>{formatTime(message.created_at)}</span>
                                {isCurrentUser && (
                                  <div className="ml-2">
                                    {message.is_read ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <Circle className="w-3 h-3" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-end space-x-3">
                      <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      
                      <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#27465C] focus-within:border-transparent">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          rows={1}
                          className="w-full px-3 py-2 resize-none focus:outline-none"
                          style={{ minHeight: '40px', maxHeight: '120px' }}
                        />
                      </div>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="bg-[#27465C] text-white p-2 rounded-lg hover:bg-[#1e3a4a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the sidebar to start messaging.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostMessaging;