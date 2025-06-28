# Manoj Chat

A modern, responsive chat application built with Next.js and TypeScript, featuring a clean UI and seamless integration with a Flask backend.

![Manoj Chat](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Real-time Chat Interface**: Clean, modern chat UI with message bubbles
- **Persistent Storage**: Messages are saved locally using localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Visual feedback during message sending and loading
- **Message History**: Automatic scroll to latest messages
- **Clear Chat Functionality**: Option to clear entire chat history
- **Error Handling**: Graceful error handling with user-friendly messages
- **Backend Integration**: Connects to Flask backend for AI-powered responses
- **Modern UI**: Built with Tailwind CSS and Lucide React icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Flask backend running on `http://127.0.0.1:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 📱 Usage

### Sending Messages
1. Type your message in the input field at the bottom
2. Press Enter or click the send button
3. Messages are sent to the Flask backend for processing
4. Responses appear in the chat interface

### Managing Chat
- **Clear Chat**: Click the trash icon in the header to clear all messages
- **Message History**: Messages are automatically saved and restored on page reload
- **Real-time Updates**: New messages appear instantly with smooth animations

## 🏗️ Project Structure

```
frontend/
├── src/
│   └── app/
│       ├── page.tsx          # Main chat interface
│       ├── layout.tsx        # Root layout component
│       └── globals.css       # Global styles
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🔧 Configuration

### Backend URL
The application is configured to connect to a Flask backend at `http://127.0.0.1:5000`. To change this:

1. Open `src/app/page.tsx`
2. Find the fetch call in the `sendMessage` function
3. Update the URL to match your backend endpoint

### Environment Variables
Create a `.env.local` file in the root directory for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:

- Colors: Modify the color classes in the components
- Layout: Adjust spacing and sizing classes
- Typography: Change font sizes and weights

### Components
The main components are:

- **CustomAlert**: Modal dialog for confirmations
- **Message Bubbles**: Styled chat messages
- **Input Area**: Message input with send button
- **Header**: Application header with status and clear button

## 🔌 Backend Integration

The frontend expects the Flask backend to:

- Accept POST requests to `/chat`
- Expect JSON payload: `{ "message": "user message" }`
- Return JSON response with one of these formats:
  - `{ "reply": "bot response" }`
  - `{ "response": "bot response" }`
  - `{ "message": "bot response" }`
  - Direct string response

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Deploy the `.next` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check that your Flask backend is running on the correct port
2. Ensure all dependencies are installed
3. Check the browser console for error messages
4. Verify your network connection

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] File upload support
- [ ] Voice messages
- [ ] Message reactions
- [ ] Dark mode toggle
- [ ] Message search functionality
- [ ] Export chat history
- [ ] Multiple chat rooms

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
