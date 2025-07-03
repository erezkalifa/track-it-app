# TrackIt - Job Application Tracking System

TrackIt is a modern, full-stack application designed to help job seekers efficiently manage and track their job applications throughout the job search process. Built with a robust Python backend and a responsive React frontend, TrackIt provides a seamless experience for organizing job applications, tracking application statuses, and managing related documents.

## 🌟 Features

- **Job Application Management**: Create, update, and track job applications
- **Document Storage**: Securely store and manage resumes and cover letters
- **Status Tracking**: Monitor application progress with customizable status updates
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern UI that works seamlessly across all devices
- **Real-time Updates**: Instant status updates and notifications

## 🏗️ Technology Stack

### Backend (Python)

- **Framework**: FastAPI - High-performance async framework
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with Python-Jose and Passlib
- **File Handling**: Built-in file service for document management
- **API Documentation**: Automatic Swagger/OpenAPI documentation
- **Deployment**: Railway platform deployment

### Frontend (React)

- **Framework**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Styled Components with custom theme
- **UI Components**: Custom-built components with modern design
- **Routing**: React Router for seamless navigation
- **API Integration**: Axios for HTTP requests
- **Form Handling**: Custom form management

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 16+
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd trackIt-backend
   ```

2. Create and activate virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   ```bash
   cp config/environments/development.env .env
   ```

   Edit `.env` with your database and JWT settings

5. Initialize the database:

   ```bash
   alembic upgrade head
   ```

6. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd trackIt-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏛️ Architecture

### Backend Architecture

- **API Layer**: RESTful endpoints using FastAPI
- **Service Layer**: Business logic implementation
- **Data Layer**: SQLAlchemy models and database interactions
- **Auth Layer**: JWT-based authentication and authorization
- **File Service**: Document storage and management
- **Error Handling**: Comprehensive error management system

### Frontend Architecture

- **Component Structure**: Reusable UI components
- **Context Management**: Global state handling
- **Route Management**: Protected and public routes
- **API Integration**: Centralized API service
- **Theme System**: Customizable styling system
- **Error Boundaries**: Graceful error handling

## 📱 Features in Detail

### User Authentication

- Secure registration and login system
- JWT token management
- Password hashing with bcrypt
- Protected route handling

### Job Application Management

- CRUD operations for job applications
- Status tracking system
- Document attachment capability
- Search and filter functionality

### Document Management

- Secure file upload system
- Version control for documents
- File type validation
- Automatic file organization

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- SQL injection prevention
- File upload security measures
- Environment variable protection

## 🚀 Deployment

The application is deployed on Railway platform with:

- Automated deployment pipeline
- PostgreSQL database integration
- Environment variable management
- Automatic SSL/TLS certification
- Continuous monitoring

## 🛠️ Development Practices

- Type safety with TypeScript
- Comprehensive error handling
- Responsive design principles
- Clean code architecture
- RESTful API design
- Secure authentication practices

## 📈 Future Enhancements

- Email notification system
- Advanced analytics dashboard
- Interview scheduling integration
- AI-powered job matching
- Mobile application development
- Enhanced reporting features

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python framework
- React team for the frontend framework
- Railway for deployment platform
- All contributors and supporters of the project
