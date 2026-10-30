# Restaurant Management System

A modern, full-featured restaurant management solution built with Next.js, featuring role-based access control and a beautiful user interface.

## Features

### For Administrators
- Complete menu management
- Financial reporting and analytics
- User access control
- Order tracking and management

### For Chefs
- Real-time order queue management
- Kitchen display system
- Inventory management
- Order status updates

### For Customers
- Intuitive menu browsing
- Easy ordering process
- Real-time order tracking
- Order history

## Tech Stack

- **Frontend Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Context + localStorage
- **Authorization**: Role-based access control

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chintanonweb/restaurant-management-system.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Test Credentials

Use these credentials to test different user roles:

- **Admin Account**
  - Username: admin
  - Password: 2025DEVChallenge

- **Chef Account**
  - Username: chef
  - Password: 2025DEVChallenge

- **Customer Account**
  - Username: newuser
  - Password: 2025DEVChallenge

## Project Structure

```
├── app/                  # Next.js 13 app directory
│   ├── admin/           # Admin dashboard and management
│   ├── chef/            # Kitchen management interface
│   ├── customer/        # Customer dashboard and ordering
│   └── menu/            # Menu browsing interface
├── components/          # Reusable React components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and types
└── public/             # Static assets
```

## Key Features

### Menu Management
- Add, edit, and delete menu items
- Categorize menu items
- Set item availability
- Upload item images

### Order Processing
- Real-time order tracking
- Status updates (pending, preparing, ready, delivered)
- Special instructions handling
- Order history

### User Management
- Role-based access control
- User authentication
- Profile management

### Kitchen Display
- Order queue management
- Preparation time tracking
- Status updates
- Inventory management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## What I Built

I built a comprehensive Restaurant Management System that addresses the common challenges faced by restaurants in managing their operations efficiently. The system provides a unified platform for administrators, chefs, and customers, streamlining the entire process from menu management to order fulfillment.

The key problems it solves include:
- Centralizing menu management and order processing
- Providing real-time communication between kitchen and front-end staff
- Offering customers an intuitive ordering experience
- Implementing role-based access control for security
- Managing inventory and tracking sales analytics

## My Journey

During the development of this project, I faced several challenges and learned valuable lessons:

1. **State Management Complexity**
   - Challenge: Managing complex state across multiple user roles and features
   - Solution: Implemented React Context with custom hooks for better state organization
   - Learning: The importance of proper state management architecture in large applications

2. **Real-time Updates**
   - Challenge: Keeping order status and inventory synchronized
   - Solution: Used React's state management with localStorage for persistence
   - Learning: Effective strategies for handling real-time data updates

3. **Role-based Access Control**
   - Challenge: Implementing secure and flexible authorization
   - Solution: Integrated Permit.io for robust authorization management
   - Learning: The importance of separating authentication and authorization concerns

## Using Permit.io for Authorization

In this project, we used Permit.io's API-first approach for authorization. The implementation involved:

1. **Initial Setup**
   - Created a Permit.io account and project
   - Configured environment variables for Permit.io integration
   - Initialized the Permit client in our application

2. **Authorization Logic**
   - Implemented role-based access control using Permit.io's policies
   - Created custom hooks for permission checking
   - Integrated authorization checks throughout the application

## API-First Authorization

The project implements an API-first authorization approach using Permit.io:

1. **Authorization Architecture**
   - Centralized permission management through Permit.io's dashboard
   - Defined clear authorization policies for each user role
   - Implemented fine-grained access control at the API level

2. **Key Benefits**
   - Scalable and maintainable authorization logic
   - Consistent access control across all endpoints
   - Easy policy updates without code changes
   - Real-time policy enforcement

3. **Implementation Details**
   - Used Permit.io's SDK for policy enforcement
   - Implemented middleware for API route protection
   - Created reusable hooks for permission checking in components
