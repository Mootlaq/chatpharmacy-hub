# ChatPharmacy Hub

A real-time chat application for pharmacies to communicate with customers and manage product information.

## Features

- Real-time chat with Telegram integration
- Product catalog management
- Symptom-based product recommendations
- Category-based product browsing
- Instant product information sharing

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Telegram Bot API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Mootlaq/chatpharmacy-hub.git
cd chatpharmacy-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Telegram Bot Token:
```env
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Environment Variables

- `REACT_APP_TELEGRAM_BOT_TOKEN`: Your Telegram Bot API token

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
