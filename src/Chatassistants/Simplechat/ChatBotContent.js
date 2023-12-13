import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const ChatBotContent = ({ baseurl, threadid, assistantid, assistantname, model, setShowCreateChat, setShowchatbot, setmenu }) => {
    // 質問内容を格納する変数
    const [question, setQuestion] = useState('');
    // チャットとの会話履歴を格納する変数
    const [history, setHistory] = useState([]);

    // threadidとassistantidから情報を取得する関数
    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${baseurl}get_messages`, {
                params: { assistantID: assistantid, threadID: threadid }
            });
            setHistory(response.data.messages);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    // ページの読み込み時に実行
    useEffect(() => {
        fetchHistory();
    }, []);

    // 質問を送信する関数
    const handleQuestionSubmit = async () => {
        if (!question) return;  // 質問が空の場合は処理を行わない
        try {
            // chatbotへの質問を送信
            const response = await axios.post(`${baseurl}ask_simplechat`, {
                assistantID: assistantid,
                threadID: threadid,
                question: question
            });
            // chatbotからレスポンスが取れた場合
            if (response.data.messages) {
                setHistory(response.data.messages);
            } else if (response.data.error) { //エラー処理
                console.error('Error:', response.data.error);
            }
            // 質問を空にする
            setQuestion(''); 
        } catch (error) {
            console.error('Failed to send question:', error);
        }
    };

    // メニューに戻る関数
    const handleBackToMenu = () => {
        setShowchatbot(false);
        setmenu(true);
        setShowCreateChat(false);
    };

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <button 
                        className="btn btn-secondary mb-3" 
                        onClick={handleBackToMenu}
                        style={{ marginBottom: "15px" }}
                    >
                        Back to Menu
                    </button>
                    <h2>{assistantname}</h2>
                    <p>{model}</p>
                    <div className="mb-3">
                        <label htmlFor="questionInput" className="form-label">Your Question</label>
                        <textarea 
                            className="form-control" 
                            id="questionInput" 
                            rows="3"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        ></textarea>
                    </div>
                    <button 
                        className="btn btn-primary mb-3" 
                        onClick={handleQuestionSubmit}
                    >
                        Ask
                    </button>
                    <div className="mb-3">
                        <label className="form-label">Response</label>
                        <div className="p-3 border" style={{ minHeight: '100px' }}>
                            {response}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Conversation History</label>
                        <div className="p-3 border" style={{ minHeight: '200px' }}>
                            {history.map((entry, index) => (
                                <div key={index}>
                                    <strong>Q:</strong> {entry.user}
                                    <br />
                                    <strong>A:</strong> {entry.assistant}
                                    <hr />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBotContent;