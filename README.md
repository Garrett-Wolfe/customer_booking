# Call Center Customer Management Application

## Overview

This application is designed for call center operations at teir 2 support after an AI agent has failed to meet the customer needs. The support agent is already provided with the customers info (name, address, phone, etc.) The primary purpose is to ingest the customer's request and create a job in the companies job management system.

## Features

- Customer information display
- New customer creation
- Job scheduling with a weekly calendar view

## Prerequisites

- Node.js (version 14 or later)
- npm (usually comes with Node.js)
- Git

## Installation

1. Ensure you have Node.js (version 14 or later) installed.
2. Clone the repository to your local machine:
   ```
   git clone https://github.com/Garrett-Wolfe/customer_booking
   ```
3. Navigate to the project directory in your terminal:
4. Run `npm install` to install all dependencies.
5. Set up shadcn/ui components (don't use latest version as it is broken as of this writing):
   ```
   npx shadcn-ui@0.8.0 init
   ```
   Follow the prompts to configure shadcn/ui for your project.
6. Create a `.env` file in the root directory and add necessary environment variables:
   ```
   VITE_HOUSECALL_PRO_API_TOKEN=<your token>
   ```
7. Run `npm run dev` to start the development server.


## Directory Structure
```
client/
├── src/
│ ├── components/
│ ├── services/
│ ├── types/
│ ├── utils/
│ ├── lib/
│ ├── App.tsx
│ └── main.tsx
├── public/
└── package.json
```


## Code Structure and Factoring

1. **Entry**: The entry point of this application is `MainPage.tsx`.

2. **Service Layer**: API calls are abstracted into service functions `housecallProService.ts`.

3. **Type Definitions**: Type definitions are centralized in the `types` directory.

4. **Utility Functions**: Common operations are extracted into utility functions `customerOperations.ts`.

5. **UI Component Library**: The project uses a custom UI component library based on shadcn/ui.


## Proxy Configuration

The application uses a proxy configuration to handle API requests. This is set up in the `vite.config.ts` file, allowing the frontend to communicate with the backend API without running into CORS issues during development.

## Modifying Customer Information

Currently, the initial customer information is hardcoded in the `MainPage.tsx` file. To change this for testing or development purposes, locate the `incomingCustomer` object in `MainPage.tsx` and modify its properties as needed.

## Troubleshooting

If you encounter any issues during setup or running the application, try the following:

1. Ensure all dependencies are installed: `npm install`
2. Clear npm cache: `npm cache clean --force`
3. If you're having issues with shadcn/ui, refer to their official documentation for troubleshooting steps.

