# Shipsy Frontend

A modern React frontend for the Shipsy shipping management system built with Vite, Tailwind CSS, and React Router.

## Features

- 🚀 **Fast Development** - Built with Vite for lightning-fast HMR
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile First** - Responsive design that works on all devices
- 🧭 **Routing** - Client-side routing with React Router v6
- 🔍 **Search & Filter** - Advanced search and filtering capabilities
- 📊 **Dashboard** - Comprehensive overview of fleet operations
- 👥 **User Management** - Authentication and user profile management
- 🚢 **Ship Management** - Complete ship tracking and management

## Tech Stack

- **React 18** - Latest React with hooks and modern patterns
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # App entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies
```

## Pages

- **Home** (`/`) - Landing page with features and CTA
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - Fleet overview and statistics
- **Ships** (`/ships`) - Ship listing with search and filters
- **Ship Detail** (`/ships/:id`) - Detailed ship information

## Components

- **Navbar** - Navigation with responsive mobile menu
- **ShipCard** - Ship information display
- **StatusBadge** - Status indicators
- **SearchBar** - Search functionality
- **FilterDropdown** - Filter options

## Styling

The application uses Tailwind CSS with custom utility classes defined in `src/index.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.btn-outline` - Outline button variant
- `.input` - Form input styles
- `.card` - Card container styles

## API Integration

The frontend is configured to proxy API requests to the backend server running on port 5000. Update the proxy configuration in `vite.config.js` if needed.

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update navigation if needed

### Adding New Components

1. Create a new component in `src/components/`
2. Export the component
3. Import and use in your pages

### Styling

- Use Tailwind CSS utility classes
- Create custom components for repeated patterns
- Follow the established design system

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

The built application can be deployed to any static hosting service:

- **Vercel** - Zero-config deployment
- **Netlify** - Easy deployment with drag & drop
- **GitHub Pages** - Free hosting for open source projects
- **AWS S3** - Scalable static hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC 