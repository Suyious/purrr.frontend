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
- [Purrr.chat Backend](https://github.com/yourusername/purrr-backend)

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
Thank you for contributing to this open-source project! We strive to create a safe and collaborative environment at Purrr.chat. Please follow these contribution guidelines:

### Contribution Rules
1. **Fork the Repository**: Start by forking the repository before making any changes. 
2. **Create a New Branch**: Use the issue title as the name to create a new branch and start implementing your changes.
3. **Push Your Changes**: Once your changes are ready, push them to your fork, create a pull request, and wait for a review.
4. **Review Process**: We will review your changes, and if accepted, they will be merged into the master branch.
5. **Stay Updated**: Before starting new work, pull the latest changes from the master branch and merge them into your local branch to avoid conflicts.

### Working on a Task (Important)
1. **Open Issues**: Please open issues for new features in the issues section.
2. **Request Assignment**: If you wish to work on an existing issue, request to be assigned to it.
3. **No Unassigned Work**: If you start working on an issue without being assigned, we may not prioritize reviewing your changes, and they may be rejected in most cases.
4. **Assigned Work**: Once assigned, you can start working and must follow the contribution guidelines to avoid merge conflicts.

## License
This project is licensed under the ISC License.