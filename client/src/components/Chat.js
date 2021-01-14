import React, { useEffect, useState } from 'react'
import './chat.css'
import io from 'socket.io-client'
import uuid from 'uuid/v4'

const myId = uuid()
const socket = io('http://localhost:8080')
socket.on('connect', () => console.log('Connected'))

const Chat = () => {
    const [message, updateMessage] = useState('')
    const [user, updateUser] = useState('')
    const [timer, updateTimer] = useState('')
    const [messages, updateMessages] = useState([])

    useEffect(() => {
        const handleNewMessage = newMessage =>
            updateMessages([...messages, newMessage])

        socket.on('chat.message', handleNewMessage)

        return () => socket.off('chat.message', handleNewMessage)
    }, [messages])

    const handleSubmit = event => {
        event.preventDefault()

        if (message.trim()) {
            socket.emit('chat.message', {
                id: myId,
                user,
                timer,
                message
            })
            updateMessage('')
        }
    }

    const getHour = () => {
        let data = new Date();
        return data.getHours() + ':' + data.getMinutes()
    }

    const handleMsgInputChange = event =>
        updateMessage(event.target.value)

    const handleUserInputChange = event =>
        updateUser(event.target.value)

    const handleTimerChange = event =>
        updateTimer(getHour())

    return (
        <div className="container">
            <div className="main-content">
                <div className="nav-header shadow-sm bg-white rounded">
                    <span><i className="i fas fa-user-circle"></i></span>
                    <input className="nav-label nav-form-field" type="text" placeholder="Insira seu nome" onChange={handleUserInputChange} value={user} />
                </div>
                <form onSubmit={handleSubmit} onChange={handleTimerChange}>
                    <ul className="list shadow-sm bg-white rounded">
                        {messages.map((m, index) => (
                            <li className={`list-item list-item-${m.id === myId ? 'local' : 'server'}`}
                                key={index}>
                                <div className={`message message-${m.id === myId ? 'local' : 'server'}`}>
                                    <label className="info-chat">{m.user.length <= 0 ? ("Anônimo " + m.timer) : m.user + " " + m.timer}</label><br />
                                    <span >
                                        {m.message}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <input
                        className="form-field shadow-sm bg-white rounded"
                        onChange={handleMsgInputChange}
                        placeholder="Digite uma mensagem"
                        type="text"
                        value={message}
                    />
                </form>
            </div>
        </div>
    )
}

export default Chat
