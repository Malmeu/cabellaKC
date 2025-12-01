You are an expert Full-Stack Developer specializing in React, Tailwind CSS, and Supabase. 
You are tasked with building a furniture e-commerce platform called "Cabella KC".

### 1. Tech Stack & Configuration
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS (v3+).
- **Icons:** Lucide-React.
- **Database/Auth:** Supabase.
- **Routing:** React Router DOM.

### 2. Supabase Credentials
Initialize the project using these credentials in a `.env.local` file:
project_url: https://xgletbgtyyhdteunizba.supabase.co
api_key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnbGV0Ymd0eXloZHRldW5pemJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NzI0NDcsImV4cCI6MjA4MDE0ODQ0N30.g6RlxQQbYDEjbATWnFLjUc7VNqTrEGSI8zXnLULmHa8


### 3. Design System (Crucial)
- **Aesthetic:** "Apple-like" minimalism. Clean, lots of whitespace, rounded corners (rounded-2xl), smooth transitions.
- **Color Palette (Pastel & Soft):**
  - Background: `#F9FAFB` (Gray-50) or White.
  - Primary Actions: `#FF78AC` (Pastel Pink).
  - Secondary/Accents: `#A8D5E3` (Pastel Blue), `#F2F0EA` (Cream/Beige).
  - Text: Dark Gray (Slate-800) for readability, never pure black.
- **Typography:** Use a clean sans-serif font (Inter or system-ui).

### 4. Database Schema (SQL)
Please generate and run the following SQL structure in your context to understand the data:
- **Table `products`**: id, name (text), category (text), price (numeric), description (text), image_url (text), created_at.
- **Table `orders`**: id, customer_email (text), customer_name (text), status (text: 'pending', 'processing', 'ready_for_pickup', 'completed'), total_price (numeric), created_at.
- **Table `order_items`**: Link products to orders.

### 5. Core Features & Pages

#### A. Client Side (Public)
1.  **Home/Catalog:**
    - Grid view of furniture with pastel cards.
    - Filter by category.
    - "Add to Cart" button.
2.  **Cart & Checkout:**
    - Simple form: Name, Email.
    - **Logic:** When submitting, create an order in Supabase with status 'pending'.
    - **Notification:** Show a success toast: "Order received! Check your email." (Mock the email sending logic for now using console.log).

#### B. Admin Side (Protected Route)
1.  **Dashboard:**
    - List of all products.
    - Button "Add New Furniture" opening a modal/form.
    - **Form:** Upload image, set price, name, category, description.
2.  **Order Management:**
    - Kanban or List view of orders.
    - **Workflow:**
      - Admin sees new order -> Change status to "Processing".
      - When furniture is ready -> Change status to "Ready for Pickup".
      - **Trigger:** When status becomes "Ready for Pickup", the app must simulate sending an email: "Hello [Name], your order is ready. Please come to the store to pay and collect."

### 6. Implementation Plan
1.  Scaffold the Vite project with Tailwind.
2.  Set up the Supabase client `supabaseClient.js`.
3.  Create the generic Layout with a pastel Navbar.
4.  Build the Product Card and Catalog components.
5.  Build the Admin Dashboard with the "Add Product" form.
6.  Implement the Order Status toggle logic.

Start by setting up the project structure and installing dependencies.
