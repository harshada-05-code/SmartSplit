
💸 SmartSplit: AI-Powered Expense Management
A modern, real-time full-stack web application designed to simplify group expense sharing with automated categorization and optimized debt settlement.

🚀 Live Demo
https://smart-split-gamma.vercel.app

✨ Key Features
🧠 Smart Settlement Algorithm

Efficiency: Implements a Min-Cash Flow (Greedy) approach to minimize the total number of transactions between group members.

Complexity: Optimized at O(NlogN) using a balance-matching strategy.

🤖 AI Auto-Categorization

Intelligent keyword-matching engine that automatically assigns categories (Food 🍕, Travel 🚕, Shopping 🛍️) based on expense descriptions.

🔄 Real-Time Synchronization

Powered by Firebase Firestore using onSnapshot listeners.

Updates balances, recent activity, and analytics across all connected devices instantly without page refreshes.

📊 Interactive Analytics

Visual spending breakdown using Recharts.

Dynamic Dark Mode support for a personalized user experience.

💳 One-Tap Settlements

Integrated UPI Deep Linking. Generate dynamic payment links for instant settlements directly from the dashboard.

🛠️ Tech Stack
Frontend: React (Vite), Tailwind CSS v4, Framer Motion

State Management: React Hooks (useState, useEffect)

Backend/Database: Firebase (Cloud Firestore)

Charts: Recharts

Icons: Lucide-React

Deployment: Vercel (CI/CD Pipeline)

⚙️ Local Setup
Clone the repository:

Bash
git clone https://github.com/harshada-05-code/SmartSplit.git
cd SmartSplit
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root and add your Firebase credentials:

Code snippet
VITE_FIREBASE_API_KEY="AIzaSyBaKSZp9o7FvwnlDizX5Ty2sfg7BMv-l_o"
VITE_FIREBASE_AUTH_DOMAIN="smartsplit-e4550.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="smartsplit-e4550"
VITE_FIREBASE_STORAGE_BUCKET="smartsplit-e4550.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="760408283525"
VITE_FIREBASE_APP_ID="1:760408283525:web:8528f33eafbce661744cec"
Run the development server:

Bash
npm run dev
🛡️ Challenges & Solutions
Tailwind v4 Migration: Resolved PostCSS compatibility issues by implementing the @tailwindcss/postcss bridge and updating CSS @import directives.

Real-Time Validation: Built a custom validation layer for "Custom Splitting" to ensure mathematical integrity before Firestore writes.

Environment Security: Secured sensitive Firebase keys using Vercel environment variables to prevent exposure in public repositories.

Screenshot
<img width="1918" height="1020" alt="Dashboard" src="https://github.com/user-attachments/assets/ff46ee2f-3d10-403c-a13f-200884709459" />
<img width="1918" height="1016" alt="Splitting menu" src="https://github.com/user-attachments/assets/2e7583e6-31b8-4a76-bd83-5b4560734aab" />

