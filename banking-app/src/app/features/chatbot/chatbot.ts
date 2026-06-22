import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-container">
      <button class="chatbot-toggle" (click)="toggleChat()" [class.active]="isOpen">
        <i class="fas" [class.fa-times]="isOpen" [class.fa-robot]="!isOpen"></i>
      </button>

      <div class="chatbot-window" *ngIf="isOpen">
        <div class="chatbot-header">
          <div class="header-left">
            <i class="fas fa-robot"></i>
            <div>
              <span class="header-title">Sorim Bank Hub Assistant</span>
              <span class="header-status">Online</span>
            </div>
          </div>
          <button class="header-close" (click)="isOpen = false"><i class="fas fa-times"></i></button>
        </div>

        <div class="chatbot-messages" #messagesContainer>
          <div *ngFor="let msg of messages" class="message" [class.user]="msg.sender === 'user'" [class.bot]="msg.sender === 'bot'">
            <div class="message-bubble">
              <span class="message-text">{{ msg.text }}</span>
              <span class="message-time">{{ msg.timestamp | date:'HH:mm' }}</span>
            </div>
          </div>
          <div class="typing-indicator" *ngIf="isTyping">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="chatbot-input">
          <input #chatInput
            type="text"
            [(ngModel)]="userInput"
            (keyup.enter)="sendMessage()"
            placeholder="Type your question..."
            [disabled]="isTyping"
            class="input-field"
          />
          <button class="send-btn" (click)="sendMessage()" [disabled]="!userInput.trim() || isTyping">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>

        <div class="chatbot-suggestions">
          <button class="suggestion-chip" *ngFor="let s of suggestions" (click)="quickQuestion(s)">
            {{ s }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }
    .chatbot-toggle {
      width: 56px; height: 56px; border-radius: 50%; border: none;
      background: linear-gradient(135deg, #0d1b3e, #1a2d5e); color: white;
      font-size: 24px; cursor: pointer; box-shadow: 0 4px 20px rgba(13,27,62,0.4);
      transition: all 0.3s; display: flex; align-items: center; justify-content: center;
    }
    .chatbot-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(13,27,62,0.5); }
    .chatbot-window {
      position: absolute; bottom: 68px; right: 0; width: 380px; height: 520px;
      background: white; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      display: flex; flex-direction: column; overflow: hidden; animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .chatbot-header {
      background: linear-gradient(135deg, #0d1b3e, #1a2d5e); color: white;
      padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .header-left i { font-size: 22px; }
    .header-title { display: block; font-weight: 600; font-size: 14px; }
    .header-status { display: block; font-size: 11px; opacity: 0.8; }
    .header-close { background: none; border: none; color: white; font-size: 16px; cursor: pointer; opacity: 0.7; }
    .header-close:hover { opacity: 1; }
    .chatbot-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px;
      background: #f5f7fa;
    }
    .message { display: flex; }
    .message.user { justify-content: flex-end; }
    .message.bot { justify-content: flex-start; }
    .message-bubble {
      max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px;
      line-height: 1.5; position: relative;
    }
    .message.user .message-bubble {
      background: linear-gradient(135deg, #0d1b3e, #1a2d5e); color: white;
      border-bottom-right-radius: 4px;
    }
    .message.bot .message-bubble {
      background: white; color: #333; border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .message-time {
      display: block; font-size: 10px; opacity: 0.6; margin-top: 4px; text-align: right;
    }
    .message.user .message-time { color: rgba(255,255,255,0.7); }
    .message.bot .message-time { color: #999; }
    .typing-indicator { display: flex; gap: 4px; padding: 8px 14px; }
    .typing-indicator span {
      width: 8px; height: 8px; background: #ccc; border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.16s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.32s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    .chatbot-input {
      display: flex; padding: 10px; gap: 8px; border-top: 1px solid #eee;
      background: white;
    }
    .input-field {
      flex: 1; padding: 10px 14px; border: 2px solid #e0e0e0; border-radius: 10px;
      font-size: 13px; outline: none;
    }
    .input-field:focus { border-color: #1a2d5e; }
    .input-field:disabled { background: #f0f0f0; }
    .send-btn {
      width: 40px; height: 40px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #0d1b3e, #1a2d5e); color: white;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .send-btn:hover { opacity: 0.9; }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .chatbot-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px 10px;
      border-top: 1px solid #f0f0f0; background: #fafbfc;
    }
    .suggestion-chip {
      padding: 5px 12px; border-radius: 16px; border: 1px solid #d0d5dd; background: white;
      font-size: 11px; color: #555; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .suggestion-chip:hover { background: #0d1b3e; color: white; border-color: #0d1b3e; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
  `]
})
export class ChatbotComponent implements AfterViewInit {
  private authService = inject(AuthService);
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') private chatInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  isTyping = false;
  userInput = '';
  messages: ChatMessage[] = [];
  userName = '';

  suggestions = [
    'How to create account?',
    'Check my balance',
    'How to deposit money?',
    'How to transfer funds?',
    'View transaction history',
    'Tell me about loans'
  ];

  private knowledgeBase: Record<string, (name?: string) => string> = {
    'create account': (n) => `To open a new account, go to the dashboard and click the "New Account" button in Quick Actions. You'll need to choose between Savings or Current account type, enter an initial deposit amount, and provide a branch name. Accounts are created instantly! 💳`,
    'open account': (n) => `Opening an account is easy! Navigate to "New Account" from the dashboard. Select account type (Savings or Current), set your initial deposit, and pick a branch. Your account will be ready immediately. 🏦`,
    'new account': (n) => `You can create a new account right from the dashboard's Quick Actions section. Just click "New Account" and fill in the details. Both Savings and Current accounts are available. ✨`,
    'balance': (n) => `To check your balance, tap the "Check Balance" card on your dashboard. Select an account from the dropdown to view its current balance. You can also see balances on the My Accounts page. 💰`,
    'check balance': (n) => `Use the "Check Balance" card on your dashboard — just tap it, pick your account, and your balance appears instantly! 📊`,
    'deposit': (n) => `To deposit money, click the "Deposit" quick action on your dashboard. Select the account, enter the amount, and add a description. The money will be credited immediately. ✅`,
    'deposit money': (n) => `Go to Deposit from the dashboard Quick Actions. Choose your account, enter the amount, and submit. The funds are available right away. 📥`,
    'withdraw': (n) => `For withdrawals, click "Withdraw" on the dashboard. Select your account, enter the amount, and confirm. Make sure you have sufficient balance! 💸`,
    'withdrawal': (n) => `You can withdraw funds by clicking the "Withdraw" action card. Select the source account and enter the amount. Minimum balance requirements apply. 💵`,
    'transfer': (n) => `To transfer funds, use the "Transfer" option. You'll need the recipient's account number and the amount. Transfers are processed instantly between internal accounts. 🔄`,
    'fund transfer': (n) => `Send money easily via the Transfer feature. Enter the recipient's account number, amount, and a note. Instant processing for internal transfers. 💱`,
    'transaction history': (n) => `Your transaction history is available on the dashboard under Recent Transactions. For a detailed view, visit the Transaction History page. You can filter by date and account. 📋`,
    'history': (n) => `View all your past transactions in the Transaction History section. It shows deposits, withdrawals, transfers, and more with dates and amounts. 📜`,
    'statement': (n) => `Your transaction history includes all account activity. Check the dashboard for recent transactions or visit the full Transaction History page for complete details. 🧾`,
    'loan': (n) => `We offer various loan products! Go to the Loans section from the dashboard to apply. You'll need to specify loan type, amount, interest rate, and tenure. Our team reviews applications promptly. 🏦`,
    'apply loan': (n) => `Ready to apply for a loan? Navigate to "Apply Loan" from the dashboard. Fill in the loan details, and our admin team will review your application. 🚀`,
    'fd': (n) => `Fixed Deposits (FDs) are a great way to grow your savings! Visit the Fixed Deposit section to create one. Choose your amount, interest rate, and tenure. Higher rates for longer tenures! 📈`,
    'fixed deposit': (n) => `Create a Fixed Deposit from the FD section on your dashboard. FDs offer guaranteed returns with flexible tenures. The maturity amount is calculated automatically. 🎯`,
    'service': (n) => `Sorim Bank Hub offers a complete range of banking services: Savings & Current accounts, Fixed Deposits, Loans, Fund Transfers, and 24/7 online banking. All at your fingertips! 🌟`,
    'help': (n) => `Hi ${n || 'there'}! 👋 I'm your Sorim Bank Hub Assistant. I can help you with:\n\n• Opening accounts\n• Checking balances\n• Deposits & withdrawals\n• Fund transfers\n• Transaction history\n• Loans & Fixed Deposits\n\nJust ask me anything!`,
    'hi': (n) => `Hello ${n || 'there'}! Welcome to Sorim Bank Hub. How can I help you today? 😊`,
    'hello': (n) => `Hi ${n || 'there'}! Great to see you! Ask me anything about your banking needs. 🌟`,
    'thanks': () => `You're welcome! Is there anything else I can help you with? 😊`,
    'thank you': () => `Happy to help! Feel free to ask anytime. 😊`,
    'bye': () => `Goodbye! Have a great day! If you need anything, I'm just a click away. 👋`,
    'goodbye': () => `Take care! See you soon. 👋`
  };

  constructor() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.sub || 'User';
      } catch { this.userName = 'User'; }
    }
    this.messages.push({
      text: `Hello ${this.userName}! 👋 Welcome to Sorim Bank Hub. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    });
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.scrollToBottom();
        this.focusInput();
      });
    }
  }

  quickQuestion(q: string) {
    this.userInput = q;
    this.sendMessage();
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.isTyping) return;
    this.userInput = '';
    this.messages.push({ text, sender: 'user', timestamp: new Date() });
    this.isTyping = true;
    this.scrollToBottom();
    setTimeout(() => {
      try {
        this.isTyping = false;
        this.messages.push({
          text: this.getResponse(text),
          sender: 'bot',
          timestamp: new Date()
        });
        this.scrollToBottom();
      } catch {
        this.isTyping = false;
      }
    }, 80 + Math.random() * 120);
  }

  private focusInput() {
    setTimeout(() => this.chatInput?.nativeElement?.focus());
  }

  private scrollToBottom() {
    const el = this.messagesContainer?.nativeElement || document.querySelector('.chatbot-messages') as HTMLElement;
    if (el) {
      requestAnimationFrame(() => el.scrollTop = el.scrollHeight);
    }
  }

  private getResponse(input: string): string {
    const lower = input.toLowerCase().trim();
    for (const [key, handler] of Object.entries(this.knowledgeBase)) {
      if (lower.includes(key)) return handler(this.userName);
    }
    const greetings = ['how are you', 'how do you do', 'sup', 'hey', 'good morning', 'good afternoon', 'good evening'];
    for (const g of greetings) {
      if (lower.includes(g)) return this.knowledgeBase['hello'](this.userName);
    }
    return `I'm not sure I understand "${input}". Here are things I can help with:\n\n${this.suggestions.join('\n• ')}\n\nJust type or tap any of the suggestions above! 😊`;
  }
}
