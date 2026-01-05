# Quick Start Guide - AI DocTalk

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Modern web browser

## Installation

1. **Navigate to project directory:**
```bash
cd c:\Users\USER\Desktop\aidoctalk
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
# Copy from example
cp .env.example .env

# Edit .env with your configuration (optional for development)
```

## Running the Application

### Development Mode
```bash
npm start
```
- Opens app at `http://localhost:3000`
- Hot reload enabled
- Open browser DevTools for debugging

### Production Build
```bash
npm run build
```
- Creates optimized build in `build/` folder
- Ready for deployment

### Running Tests
```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable components (Toast, LoadingSpinner)
├── context/             # React Context (AuthContext)
├── services/            # API services (aiService, authService, locationService)
├── figma/               # Custom components (ImageWithFallback)
├── ui/                  # UI component library (buttons, dialogs, etc.)
├── App.js               # Main app component
├── GuestChat.jsx        # Guest chat interface
├── AuthScreen.jsx       # Login/signup screen
├── LoggedInChat.jsx     # Authenticated chat interface
├── HospitalLocator.jsx  # Hospital finder
├── index.js             # App entry point
└── ...
```

## Key Features Implemented

✅ **Authentication System**
- Login/Signup with real API calls
- JWT token management
- Auth context for global state

✅ **Chat Interface**
- Guest mode with limited AI responses
- Authenticated mode with conversation history
- Real-time message streaming (via API)
- Auto-scrolling, timestamps, typing indicators

✅ **Hospital Locator**
- Geolocation support
- Nearby hospital search
- Hospital details and ratings
- Call/Directions/Booking actions

✅ **Error Handling**
- Toast notifications for user feedback
- Loading states and spinners
- Graceful fallback to mock data
- Comprehensive error logging

✅ **User Experience**
- Responsive design (mobile-first)
- Dark/light theme support ready
- Accessibility considerations
- Smooth animations and transitions

## API Integration Status

🟡 **Currently Using Mock/Fallback Data**

The app is configured to call a backend API at `http://localhost:5000/api` but will gracefully fall back to mock data if the API is unavailable.

**To enable real API:**

1. Create a backend API (see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md))
2. Update `.env` with your API URL
3. Implement all required endpoints
4. Test with Postman or similar tool

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `REACT_APP_API_TIMEOUT` | `30000` | API request timeout (ms) |
| `REACT_APP_PAYSTACK_PUBLIC_KEY` | `` | Paystack payment key |
| `REACT_APP_ENV` | `development` | Environment mode |

## Common Issues & Solutions

### "Cannot find module" errors
```bash
npm install
npm start
```

### API endpoints returning 404
- Ensure backend server is running on port 5000
- Check API URL in `.env`
- Verify endpoints exist in backend

### Port 3000 already in use
```bash
# Kill process on port 3000 or use different port:
PORT=3001 npm start
```

### Local Storage not persisting
- Check browser's localStorage settings
- Ensure cookies/storage not blocked
- Try incognito/private mode

## Deployment Checklist

- [ ] Backend API deployed and tested
- [ ] Environment variables updated for production
- [ ] `.env` file created (use Vercel/Netlify environment variables)
- [ ] API CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Monitor API performance

## Available Scripts

| Command | Description |
|---------|------------|
| `npm start` | Run development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App (irreversible) |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimization Tips

- Use React DevTools Profiler to find bottlenecks
- Code splitting via React.lazy() for larger components
- Image optimization (use WebP where possible)
- Minify CSS/JS in production builds
- Use CDN for static assets

## Security Reminders

⚠️ **Never commit `.env` with sensitive keys**

- Use `.env.example` for template
- Add `.env` to `.gitignore`
- Use environment variables for secrets
- Rotate API keys regularly
- Keep dependencies updated: `npm audit fix`

## Getting Help

- Check [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for backend setup
- Review component documentation in code
- Check browser console for detailed error messages
- Verify backend endpoints with Postman

## Next Steps

1. ✅ Frontend setup complete
2. ⏳ Build backend API (see integration guide)
3. ⏳ Connect real AI service
4. ⏳ Set up payment processing
5. ⏳ Deploy to production

---

**Start development:** `npm start`

**Questions?** Review the code comments and API integration guide!
