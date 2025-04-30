# LibraryPal UI Service

This is the frontend application for **LibraryPal**, a microservices-based library management system. The UI is built using modern web technologies and interacts with backend services to provide a seamless user experience for library operations.

## Key Features

- User-friendly interface for interacting with the LibraryPal backend services
- Built with [Vite](https://vitejs.dev/) and optimized for performance
- Dockerized for easy deployment and consistency across environments
- Automatically checks dependencies before starting

## Prerequisites

- Docker installed and running on your machine
- The following dependent containers must be running in the same Docker network (`librarypal-net`):
  - `librarypal-users-service-container`
  - `librarypal-books-service-container`
  - `librarypal-lending-books-service-container`

## Running the Application

Run the appropriate deployment script based on your operating system:

- **For Windows**:

  ```cmd
  ./deployment-script/run-ui-service.bat
  ```

- **For macOS/Linux**:

  ```bash
  ./deployment-script/run-ui-service.sh
  ```

## Access the Application

Once the container is up and running, access the UI by opening your browser and visiting:

[http://localhost](http://localhost)

## Notes

- Ensure Docker Desktop is running before executing the script.
- The UI service runs on port **80** by default and expects the dependent microservices to be accessible within the Docker network `librarypal-net`.

## Repository

Source code: [https://github.com/soorya-bits/librarypal-ui-service.git](https://github.com/soorya-bits/librarypal-ui-service.git)