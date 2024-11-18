# **Customer Address Manager**

This project is a **Customer Address Manager** built with **Angular**. It allows users to manage customers and their addresses, featuring functionalities such as adding, editing, deleting customers and addresses, searching, and pagination.

---

## **Table of Contents**
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Using JSON Server](#using-json-server)
- [Testing](#testing)
- [License](#license)

---

## **Features**
- **Customer Management**: Add, edit, delete, and view customer details.
- **Address Management**: Add, edit, delete, and set primary addresses for each customer.
- **Search Functionality**: Search customers by name, email, or phone.
- **Pagination**: Navigate through the customer list with paginated results.
- **Responsive Design**: Built to be responsive and user-friendly.

---

## **Requirements**
Make sure you have the following installed on your machine:
- **Node.js**: `>= 14.x`
- **npm**: `>= 6.x`
- **Angular CLI**: `>= 16.x`
- **JSON Server**: `>= 0.17.x`

---

## **Setup**

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/your-username/customer-address-manager.git
cd customer-address-manager
```

### 2. Install Dependencies
Install the required npm packages:
```bash
npm install
```

### 3. JSON Server Configuration
The project uses **JSON Server** to simulate a backend API. Ensure JSON Server is globally installed:
```bash
npm install -g json-server
```

Create a `db.json` file in the root directory with the following content:
```json
{
  "customers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "addresses": [
        {
          "id": 1,
          "name": "Home",
          "street": "123 Main St",
          "city": "Springfield",
          "state": "IL",
          "country": "USA",
          "isPrimary": true
        }
      ]
    }
  ]
}
```

---

## **Running the Project**

### 1. Start the JSON Server
Run the JSON Server to serve the `db.json` file:
```bash
json-server --watch db.json --port 3000
```

This will make the JSON Server available at:
- **Base URL**: `http://localhost:3000/customers`

### 2. Start the Angular Application
Run the Angular app in development mode:
```bash
ng serve
```

The application will be accessible at:
- **Frontend**: `http://localhost:4200`

---

## **Using JSON Server**

The project uses **JSON Server** for CRUD operations. Below are some example API endpoints:
- **Get all customers**: `GET http://localhost:3000/customers`
- **Get a single customer**: `GET http://localhost:3000/customers/:id`
- **Add a new customer**: `POST http://localhost:3000/customers`
- **Update a customer**: `PUT http://localhost:3000/customers/:id`
- **Delete a customer**: `DELETE http://localhost:3000/customers/:id`

To modify the `db.json` file dynamically, you can use JSON Server's built-in API tools.

---

## **Testing**

### Unit Tests
The project uses Jasmine and Karma for unit testing.

To run the tests:
```bash
ng test
```

---

## **Project Structure**

### **Main Directories**
- **src/app/core**: Contains core models and shared logic.
- **src/app/features/customers**: Contains all customer-related components, services, and pages.
- **src/app/shared**: Contains reusable components, directives, and pipes.

### **Key Files**
- **`customers.component.ts`**: Main logic for customer management.
- **`customer.service.ts`**: Handles communication with the JSON Server.
- **`db.json`**: Mock database file for JSON Server.

---

## **Technical Stack**
- **Frontend**: Angular
- **Mock API**: JSON Server
- **Styling**: Bootstrap 5
- **Testing**: Jasmine & Karma