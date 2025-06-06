
# Geo Chat - Real-time Messaging Platform

A modern, real-time chat application built with React, TypeScript, and Supabase, featuring a WhatsApp-inspired interface with location-based chat capabilities.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery and read receipts
- **File Sharing**: Support for PDF, image, and video attachments
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Mobile-first design with dark mode support
- **Modern UI**: Clean, intuitive interface inspired by popular messaging apps
- **Location-based Chat**: Connect with users based on geographical proximity

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Query (@tanstack/react-query)

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- A Supabase account and project

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Configure authentication providers in your Supabase dashboard
   - The app is pre-configured with Supabase credentials

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🎯 Usage

### Getting Started
1. Create an account or sign in with existing credentials
2. Browse available chats in the sidebar
3. Click on any chat to start messaging
4. Use the attachment button to share files (PDF, images, videos)

### File Sharing
- Click the paperclip icon in the message input area
- Select files from your device (PDF, JPG, PNG, MP4, etc.)
- Files are automatically uploaded and shared in the chat
- Recipients can preview and download shared files

### Features Overview
- **Message Status**: See when messages are sent, delivered, and read
- **Online Status**: View real-time online/offline status of contacts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ChatList.tsx    # Chat list sidebar
│   ├── ChatWindow.tsx  # Main chat interface
│   └── FileUpload.tsx  # File attachment component
├── pages/              # Application pages
│   ├── Auth.tsx        # Authentication page
│   ├── Chat.tsx        # Main chat page
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
└── lib/                # Utility functions
```

## 🚀 Deployment

### Using Lovable (Recommended)
1. Open your [Lovable Project](https://lovable.dev/projects/efaf8898-258b-458f-b7d7-dc4e274d605b)
2. Click on "Share" → "Publish"
3. Your app will be live instantly

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your preferred hosting service

## 🔗 Custom Domain

To connect a custom domain:
1. Navigate to Project → Settings → Domains in Lovable
2. Click "Connect Domain" and follow the instructions
3. Note: A paid Lovable plan is required for custom domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Troubleshooting

### Common Issues
- **Authentication not working**: Ensure Supabase is properly configured
- **File uploads failing**: Check Supabase storage bucket permissions
- **App not loading**: Verify all environment variables are set correctly

### Getting Help
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Join our [Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review the [troubleshooting guide](https://docs.lovable.dev/tips-tricks/)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
This project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (configured in your editor)

---

Built with ❤️ using [Lovable](https://lovable.dev) - The AI-powered web development platform
