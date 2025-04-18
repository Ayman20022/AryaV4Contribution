# Arya v4

This repository contains the frontend React application of our project.

## Project Structure

```
repository/
├── frontend/        # React frontend application
│   └── README.md    # Frontend specific documentation
```

## Frontend React Application

The `frontend/` directory contains our React application.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or later recommended)
- npm

### Running

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

The application should now be running at [http://localhost:8080](http://localhost:8080).

### Frontend Project Structure

```
frontend/ (may change in the future)
├── public/          # Public assets and index.html
├── src/             # Source code  
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── data/        # Mock data
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── lib/         # Utility functions
│   ├── App.tsx      # Main App component
│   ├── App.css      # App component style
│   ├── index.css    # Main style
│   └── main.tsx     # Application entry point
└── package.json     # Dependencies and scripts
```



3. Swagger UI:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Note: It make take a little bit to run all the services
