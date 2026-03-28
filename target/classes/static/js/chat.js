// ==================== الإعدادات الأساسية ====================
const API_URL = 'http://localhost:8081/chat';

// ==================== عناصر الصفحة ====================
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// ==================== فتح/إغلاق الشريط الجانبي ====================
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

// عند النقر على زر القائمة
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

// عند النقر على طبقة التغطية
sidebarOverlay.addEventListener('click', closeSidebar);

// منع إغلاق الشريط عند النقر داخله
sidebar.addEventListener('click', (e) => {
    e.stopPropagation();
});

// إغلاق الشريط بالضغط على ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

// ==================== إدارة المحادثات ====================
let sessions = [];
let currentSessionId = null;

// تحميل المحادثات
function loadSessions() {
    const saved = localStorage.getItem('phi3_chat_sessions');
    if (saved) {
        sessions = JSON.parse(saved);
    } else {
        const welcomeSession = {
            id: 'session_' + Date.now(),
            title: 'المحادثة الترحيبية',
            createdAt: new Date().toISOString(),
            messages: [{
                id: Date.now(),
                sender: 'bot',
                text: '👋 مرحباً! أنا بوت G11 المدعوم بـ Phi3. اسألني أي شيء وسأجيبك!',
                time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
            }]
        };
        sessions = [welcomeSession];
        currentSessionId = welcomeSession.id;
        saveSessions();
    }
    
    if (!currentSessionId && sessions.length > 0) {
        currentSessionId = sessions[0].id;
    }
}

function saveSessions() {
    localStorage.setItem('phi3_chat_sessions', JSON.stringify(sessions));
}

function getCurrentSession() {
    return sessions.find(s => s.id === currentSessionId);
}

// عرض المحادثات في الشريط الجانبي
function renderSidebar() {
    const historyDiv = document.getElementById('chatHistory');
    historyDiv.innerHTML = '';
    
    sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sessions.forEach(session => {
        const date = new Date(session.createdAt);
        const item = document.createElement('div');
        item.className = `history-item ${session.id === currentSessionId ? 'active' : ''}`;
        
        item.innerHTML = `
            <div class="history-item-title">${escapeHtml(session.title)}</div>
            <div class="history-item-date">
                <i class="fa-regular fa-clock"></i>
                ${date.toLocaleDateString('ar-EG')} - ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button class="delete-chat" onclick="deleteSession('${session.id}', event)">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        
        item.addEventListener('click', () => switchToSession(session.id));
        historyDiv.appendChild(item);
    });
}

// عرض الرسائل
function renderMessages() {
    const currentSession = getCurrentSession();
    if (!currentSession) return;
    
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = currentSession.messages.map(msg => `
        <div class="message ${msg.sender}">
            <div class="msg-avatar">
                <i class="fa-${msg.sender === 'user' ? 'regular' : 'solid'} fa-${msg.sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="bubble">${escapeHtml(msg.text)}</div>
        </div>
    `).join('');
    
    scrollToBottom();
}

// التبديل بين المحادثات
function switchToSession(sessionId) {
    currentSessionId = sessionId;
    renderSidebar();
    renderMessages();
    closeSidebar(); // إغلاق الشريط بعد الاختيار
}

// إنشاء محادثة جديدة
function createNewSession() {
    const newSession = {
        id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: 'محادثة جديدة',
        createdAt: new Date().toISOString(),
        messages: [{
            id: Date.now(),
            sender: 'bot',
            text: '👋 مرحباً! كيف يمكنني مساعدتك اليوم؟',
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]
    };
    
    sessions.push(newSession);
    saveSessions();
    switchToSession(newSession.id);
}

// حذف محادثة
window.deleteSession = function(sessionId, event) {
    event.stopPropagation();
    
    if (sessions.length === 1) {
        alert('لا يمكن حذف آخر محادثة.');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
        sessions = sessions.filter(s => s.id !== sessionId);
        
        if (currentSessionId === sessionId) {
            currentSessionId = sessions[0].id;
        }
        
        saveSessions();
        renderSidebar();
        renderMessages();
    }
};

// إرسال رسالة
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    
    const currentSession = getCurrentSession();
    if (!currentSession) return;
    
    // رسالة المستخدم
    const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    
    currentSession.messages.push(userMessage);
    
    // تحديث العنوان
    if (currentSession.messages.filter(m => m.sender === 'user').length === 1) {
        currentSession.title = text.length > 25 ? text.substring(0, 22) + '...' : text;
    }
    
    saveSessions();
    renderMessages();
    
    input.value = '';
    showTyping();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, sessionId: currentSession.id })
        });
        
        const data = await response.json();
        removeTyping();
        
        const botMessage = {
            id: Date.now(),
            sender: 'bot',
            text: data.reply || data.response || data.message || 'تم الاستلام',
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        
        currentSession.messages.push(botMessage);
        saveSessions();
        renderMessages();
        
    } catch (error) {
        console.error('Error:', error);
        removeTyping();
        
        const errorMessage = {
            id: Date.now(),
            sender: 'bot',
            text: '⚠️ خطأ في الاتصال',
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        
        currentSession.messages.push(errorMessage);
        saveSessions();
        renderMessages();
    }
    
    renderSidebar();
}

// دوال مساعدة
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    setTimeout(() => {
        const chatArea = document.getElementById('chatArea');
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 50);
}

function showTyping() {
    const chatArea = document.getElementById('chatArea');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="typing-indicator"><span></span><span></span><span></span></div>
    `;
    chatArea.appendChild(typingDiv);
    scrollToBottom();
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// ==================== التهيئة ====================
document.addEventListener('DOMContentLoaded', function() {
    loadSessions();
    renderSidebar();
    renderMessages();
    
    document.getElementById('newChatBtn').addEventListener('click', createNewSession);
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    
    const input = document.getElementById('messageInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
});