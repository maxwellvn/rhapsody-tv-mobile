# Rhapsody TV Mobile App 📱

A modern React Native mobile application built with Expo for streaming Christian content, live broadcasts, and on-demand programs from Rhapsody TV.

![Rhapsody TV](./assets/logo/Logo.png)

## 📖 About

Rhapsody TV is a comprehensive mobile streaming platform that brings inspirational Christian content to your fingertips. Watch live broadcasts, explore diverse channels, discover programs, and stay connected with uplifting content anytime, anywhere.

## ✨ Features

### Authentication
- **User Registration** - Create account with full name, username, email, and password
- **Sign In** - Secure login with email/username and password
- **KingsChat Integration** - Quick sign-in with KingsChat account
- **Email Verification** - OTP-based email verification with auto-focus input
- **Forgot Password** - Password recovery flow

### Home Screen
- **Live Now Section** - Watch currently broadcasting content with live badge
- **Continue Watching** - Resume your previously watched content
- **Channels List** - Browse all available channels with live indicators
- **Programs** - Explore curated program collections
- **Featured Videos** - Highlighted content with series/new badges
- **Program Highlights** - Top program highlights
- **Smart Search** - Search channels and programs with auto-complete

### Discover
- **Dual Tab Interface** - Switch between Channels and Programs
- **Channels Grid** - Browse all channels in an organized grid layout
- **Programs Grid** - Explore all programs with preview thumbnails
- **Smart Filtering** - Search functionality with clear button
- **Live Indicators** - Real-time status badges on channels

### Navigation
- **Bottom Tab Navigation** - Quick access to Home, Discover, Schedule, and Profile
- **Smooth Transitions** - Seamless navigation between screens
- **Active State Indicators** - Visual feedback for current tab

### UI/UX Features
- **Splash Screen** - Beautiful branded splash screen
- **Onboarding** - Interactive carousel introducing app features
- **Responsive Design** - Optimized for various screen sizes
- **Custom Components** - Reusable, modular UI components
- **Badge System** - Live, New, Series badges for content
- **Image Carousels** - Smooth horizontal scrolling content

## 🛠️ Tech Stack

### Core
- **React Native** `0.81.5`
- **Expo SDK** `~54.0.31`
- **React** `19.1.0`
- **TypeScript** - Type-safe development

### Navigation & Routing
- **Expo Router** - File-based routing system

### UI & Styling
- **React Native StyleSheet** - Custom styling
- **@expo/vector-icons** - Icon library
- **expo-status-bar** - Status bar management

### Fonts
- **@expo-google-fonts/inter** - Inter font family
- **expo-font** - Font loading

### Development
- **TypeScript** - Static type checking
- **Expo CLI** - Development tools

## 📁 Project Structure

```
rhapsody-tv/
├── app/                          # Main application
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx         # Auth layout
│   │   ├── register.tsx        # Registration screen
│   │   ├── signin.tsx          # Sign in screen
│   │   └── verify-email.tsx    # Email verification
│   ├── (tabs)/                  # Tab navigation screens
│   │   ├── _layout.tsx         # Tabs layout
│   │   ├── index.tsx           # Home screen
│   │   └── discover.tsx        # Discover screen
│   ├── _layout.tsx             # Root layout
│   ├── index.tsx               # Splash screen
│   └── onboarding.tsx          # Onboarding screen
├── components/                  # Reusable components
│   ├── discover/               # Discover page components
│   │   ├── channel-card.tsx    # Channel card for grid
│   │   ├── channels-tab.tsx    # Channels tab content
│   │   ├── programs-tab.tsx    # Programs tab content
│   │   └── video-card.tsx      # Video card for grid
│   ├── home/                   # Home page components
│   │   ├── channel-card.tsx    # Channel card for carousel
│   │   ├── channels-list-section.tsx
│   │   ├── continue-watching-section.tsx
│   │   ├── featured-videos-section.tsx
│   │   ├── live-now-section.tsx
│   │   ├── program-highlights-section.tsx
│   │   ├── programs-section.tsx
│   │   └── video-card.tsx      # Video card for carousel
│   ├── auth-tabs.tsx           # Register/Sign In tabs
│   ├── badge.tsx               # Live/New/Series badges
│   ├── bottom-nav.tsx          # Bottom navigation bar
│   ├── button.tsx              # Reusable button
│   └── search-bar.tsx          # Search input with clear
├── styles/                      # StyleSheet definitions
│   ├── discover.styles.ts      # Discover page styles
│   ├── global.ts               # Global styles & fonts
│   ├── home.styles.ts          # Home page styles
│   ├── onboarding.styles.ts    # Onboarding styles
│   ├── register.styles.ts      # Auth screens styles
│   └── verify-email.styles.ts  # Verification styles
├── assets/                      # Static assets
│   ├── fonts/                  # Custom fonts
│   ├── Icon/                   # KingsChat icons
│   ├── Icons/                  # UI icons
│   ├── images/                 # Content images
│   └── logo/                   # Brand logos
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── app.json                    # Expo config
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GPD-Tech-Hub/Rhapsody_Tv.git
   cd Rhapsody_Tv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## 📱 Screenshots

### Authentication Flow
<!-- Add screenshots here -->
- Splash Screen with Rhapsody TV branding
- Interactive onboarding carousel
- Registration with KingsChat integration
- Sign in with password visibility toggle
- Email verification with OTP input

### Home Screen
<!-- Add screenshots here -->
- Live streaming section with live badge
- Continue watching carousel
- Channels list with live indicators
- Programs and featured content sections
- Smart search with suggestions

### Discover
<!-- Add screenshots here -->
- Channels/Programs tab switcher
- Grid layout for easy browsing
- Live status indicators
- Detailed program information

## 🎨 Design Features

- **Custom Color Scheme** - Blue (#0000FF) primary brand color
- **Inter Font Family** - Clean, modern typography
- **Rounded Corners** - Soft, approachable UI elements
- **Shadow Effects** - Depth and hierarchy
- **Badge System** - Visual content categorization
- **Responsive Grid** - Adaptive layouts
- **Smooth Animations** - Natural transitions

## 🔧 Configuration

### Expo Configuration (`app.json`)
```json
{
  "expo": {
    "name": "Rhapsody_tv",
    "slug": "rhapsody-tv",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"]
  }
}
```

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.31",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "latest",
  "expo-font": "latest",
  "@expo-google-fonts/inter": "latest",
  "@expo/vector-icons": "latest"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

**GPD Tech Hub**
- GitHub: [@GPD-Tech-Hub](https://github.com/GPD-Tech-Hub)
- Repository: [Rhapsody TV](https://github.com/GPD-Tech-Hub/Rhapsody_Tv)

## 🙏 Acknowledgments

- Rhapsody TV for the amazing content
- Expo team for the excellent framework
- React Native community for continuous support

---

**Built with ❤️ using React Native & Expo**
