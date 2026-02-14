import { useEffect, useState, useRef, useCallback } from 'react';
import { Typography, List, Avatar, Input, Button, Empty, Spin, Card } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { getConversations, getMessages, sendMessage } from '../api/conversations';
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
import ReportButton from '../components/moderation/ReportButton';
import type { Conversation, Message } from '../types';

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(searchParams.get('conversation'));
  const [input, setInput] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const { dbUser } = useUser();

  const fetchConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const data = await getMessages(convId);
      setMessages(data.messages);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv);
      socket?.emit('chat:join', activeConv);
      return () => {
        socket?.emit('chat:leave', activeConv);
      };
    }
  }, [activeConv, socket, fetchMessages]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('chat:message', handler);
    return () => {
      socket.off('chat:message', handler);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    try {
      if (socket?.connected) {
        socket.emit('chat:message', { conversationId: activeConv, content: input.trim() });
      } else {
        const msg = await sendMessage(activeConv, input.trim());
        setMessages((prev) => [...prev, msg]);
      }
      setInput('');
    } catch {
      // ignore
    }
  };

  const selectConversation = (id: string) => {
    setActiveConv(id);
    setSearchParams({ conversation: id });
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p.userId !== dbUser?.id)?.user;
  };

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 180px)' }}>
      {/* Conversation list */}
      <Card
        title="Conversations"
        style={{ width: 320, overflow: 'auto', flexShrink: 0 }}
        styles={{ body: { padding: 0 } }}
      >
        {loadingConvs ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : (
          <List
            dataSource={conversations}
            renderItem={(conv) => {
              const other = getOtherParticipant(conv);
              return (
                <List.Item
                  onClick={() => selectConversation(conv.id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: activeConv === conv.id ? '#f0f0f0' : 'transparent',
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={other?.avatar} icon={<UserOutlined />} />}
                    title={other?.nickname || 'Utilisateur'}
                    description={
                      <Typography.Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                        {conv.listing?.title}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              );
            }}
            locale={{ emptyText: <Empty description="Aucune conversation" /> }}
          />
        )}
      </Card>

      {/* Messages */}
      <Card
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' } }}
      >
        {!activeConv ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Empty description="Sélectionnez une conversation" />
          </div>
        ) : loadingMsgs ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {messages.map((msg) => {
                const isMe = msg.senderId === dbUser?.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '8px 12px',
                        borderRadius: 12,
                        background: isMe ? '#1677ff' : '#f0f0f0',
                        color: isMe ? '#fff' : '#000',
                      }}
                    >
                      {!isMe && (
                        <Typography.Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>
                          {msg.sender?.nickname || 'Utilisateur'}
                        </Typography.Text>
                      )}
                      <div>{msg.content}</div>
                      <div style={{ fontSize: 10, opacity: 0.7, textAlign: 'right', marginTop: 2 }}>
                        {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {!isMe && (
                        <ReportButton targetType="MESSAGE" messageId={msg.id} />
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Votre message..."
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
