# ZenMix - Meditation Audio Mixing Platform

## Overview
ZenMix is a web application that allows users to create custom meditation experiences by mixing different audio tracks, ambient sounds, and guided meditations. The platform provides an intuitive interface for creating, saving, and sharing personalized meditation mixes.

## Features
- Custom audio mixing with multiple tracks
- Built-in equalizer with frequency control
- Master EQ with progress tracking
- Track-level volume and EQ controls
- Meditation timer with customizable duration
- User authentication and profiles
- Personal library with grid and list views
- Mix saving and sharing capabilities
- Mobile-responsive design
- Progress visualization for tracks and mixes

## Recent Updates
- Added SoundCloud-like progress bars to visualize track playback
- Implemented master mix progress tracking with timer display
- Added toggle between grid and list views in the library
- Enhanced mobile navigation with proper spacing
- Improved UI for track controls and mix information
- Fixed scrollbar visibility for cleaner interface

## Tech Stack
- React
- Vite
- Tailwind CSS
- Supabase (Auth & Database)
- Howler.js (Audio)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/bigocox1970/ZenMix.git
cd ZenMix
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials (see `.env.example`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure
- `/src` - Source code
  - `/components` - React components
  - `/contexts` - Context providers
  - `/hooks` - Custom React hooks
  - `/pages` - Page components
- `/public` - Static assets
- `/screen-shots` - Application screenshots

## Deployment
The project is deployed on Netlify at: [https://zenmixapp.netlify.app](https://zenmixapp.netlify.app)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License - see LICENSE file for details