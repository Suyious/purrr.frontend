# Purrr.chat Frontend

This repository contains the frontend code for **Purrr.chat**, a random chat application that allows users to connect with each other for text and image-based communication.

## Features
- **Random Chat**: Users are randomly paired with another online user for a chat.
- **Image Sharing**: Share images during the chat.
- **Real-Time Messaging**: Communication happens in real-time using WebSockets via `socket.io-client`.
- **Next.js**: The frontend is built with the powerful and scalable Next.js framework.
- **Tailwind CSS**: Responsive and customizable UI using Tailwind CSS.

## Technologies Used
- **Next.js**: v14.2.12
- **React**: ^18
- **WebSockets**: Handled by `socket.io-client` (v4.7.5)
- **Tailwind CSS**: For UI styling
- **TypeScript**: For type safety and better development experience.

## Related Repositories
- [Purrr.chat Frontend](https://github.com/yourusername/purrr-frontend)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/purrr-frontend.git
    cd purrr-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Scripts

- `npm run dev`: Run the application in development mode.
- `npm run build`: Build the application for production.
- `npm start`: Start the application in production mode.
- `npm run lint`: Run the linter for the codebase.

## Contributing
Feel free to fork this repository and make your own changes. Pull requests are welcome!

## License
This project is licensed under the ISC License.