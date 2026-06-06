import { useState, useEffect, useRef } from 'react'
import style from "./styles.module.css";
import { useSubscription } from '@apollo/client/react';
import { MESSAGES_SUBSCRIPTION } from './queries';
import { nanoid } from 'nanoid';


function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const { data, error } = useSubscription(MESSAGES_SUBSCRIPTION);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([
      ...messages,
      {
        id: nanoid(),
        text: inputValue,
        sender: "Siz"
      }
    ]);
    setInputValue("");
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data && data.messageSent) {
      data.messageSent.sender = `User ${data.messageSent.id.slice(0, 5)}`;
      setMessages((prev) => [...prev, data.messageSent]);
    }
  }, [data]);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={style.chatScreenContainer}>
      <div className={style.chatCard}>

        {/* Üst Başlık Alanı */}
        <div className={style.chatHeader}>
          <div className={style.headerInfo}>
            <span className={style.chatTitle}>Anonymous Chat</span>
            <span className={style.chatStatus}>
              <span className={`${style.statusDot} ${messages.length === 0 ? style.passive : style.active}`}></span>
              {messages.length === 0 ? 'Pasif' : 'Aktif'}
            </span>
          </div>
        </div>

        {/* Mesaj Listesi */}
        <div className={style.chatMessagesArea}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${style.messageRow} ${msg.sender === "Siz" ? style.rightAligned : ""}`}
            >

              {/* Sol taraftaki Avatar ve İsim Bloğu */}
              <div className={style.metaContainer}>
                <div className={style.messageAvatar}>
                  {msg.sender.charAt(0)}
                </div>
                <div className={style.messageSender}>{msg.sender}</div>
              </div>

              {/* Sağ tarafa gelen Mesaj Balonu */}
              <div className={style.messageBubble}>
                {msg.text}
              </div>

            </div>
          ))}
          {/* 4. Scroll'un odaklanacağı en alttaki görünmez boş div */}
          <div ref={messagesEndRef} />
        </div>

        {/* Alt Giriş Alanı */}
        <div className={style.chatFooter}>
          <input
            type="text"
            className={style.chatInputField}
            placeholder="Bir mesaj yazın..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className={style.chatSendBtn} onClick={handleSend}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home