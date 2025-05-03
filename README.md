# FLXA Token Service

Welcome to the official repository for the FLXA Token Service, developed by FLXA Indonesia. This service facilitates token-related operations within the FLXA ecosystem alongside with the capabilities of the IOTA distributed ledger technology.

## Overview
The FLXA Token Service provides a backend solution for managing token issuance, transfers, and related functionalities. Built with Node.js.

## Features
- Token Issuance: Create and manage FLXA tokens on the IOTA network.
- Token Transfers: Facilitate secure token transfers between accounts.
- IOTA Integration: Interact with the IOTA Tangle for decentralized token management.
- RESTful API: Expose endpoints for frontend and other services integration.
- Deployment Ready: Configured for deployment on platforms like Vercel.

## Repository Structure
```bash
├── src/                  # Source code directory
│   └── ...               # Application logic and route handlers
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Git ignore rules
├── index.js              # Entry point of the application
├── package.json          # Project metadata and dependencies
├── pnpm-lock.yaml        # Lockfile for pnpm package manager
└── vercel.json           # Vercel deployment configuration
```

## Getting Started
### Prerequisites
- Node.js (version 14 or higher)
- pnpm package manager

### Installation
1. Clone the repository:
```bash
git clone https://github.com/FLXA-Indonesia/FLXA-Token-Service-IOTA.git
cd FLXA-Token-Service-IOTA
```

2. Install dependencies:
```bash
pnpm install
```

### Running the Application
To start the development server:
```bash
pnpm start
```

The server will start on the default port (e.g., http://localhost:3000). You can modify the port and other configurations as needed.

### Deployment
The project includes a vercel.json file, making it ready for deployment on Vercel. To deploy:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Follow the prompts to complete the deployment process.

## API Endpoints
The service exposes the RESTful API endpoints accessible at `/src/routes`

Note: Authentication and authorization mechanisms should be implemented to secure these endpoints.

## Contributing
We welcome contributions to enhance the FLXA Token Service. To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Push your branch and open a pull request detailing your modifications.
5. Please ensure your code adheres to the project's coding standards and includes relevant tests.

## License
This project is licensed under the [GNU Affero General Public License V3](LICENSE)
