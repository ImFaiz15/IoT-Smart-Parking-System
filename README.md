# Smart Parking System (IoT SPS) 🚗

A **full-stack Smart Parking System** that helps users view parking availability, park/depart vehicles, and manage parking data through a clean dashboard interface.  
The project is designed with a modern UI and a backend-ready structure for future **admin portal**, **history tracking**, and **database-driven user management**.

---

## 📌 Project Overview

| Item | Details |
|---|---|
| Project Name | Smart Parking System |
| Type | Full Stack Web Application |
| Domain | IoT / Web Development / Smart City |
| Main Goal | Manage parking slots efficiently with a user-friendly interface |
| Future Scope | Admin portal, reservation system, history page, real-time updates |

---

## ✨ Features

| Feature | Description |
|---|---|
| Dashboard UI | Displays parking slots in a clean and responsive layout |
| Slot Status | Shows slots as available, occupied, or reserved |
| Park Vehicle | Allows user to occupy a slot |
| Depart Vehicle | Frees the slot after departure |
| Login / Signup | User authentication for secure access |
| Feedback Section | Users can share feedback |
| History Ready | Structure prepared for parking history |
| Admin Ready | Can be extended for admin panel in future |

---

## 🛠️ Tech Stack

| Layer | Technologies Used | Purpose |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Page structure, styling, and client-side logic |
| UI Framework | Bootstrap 5 | Responsive design and components |
| Icons | Font Awesome | Better visual representation |
| Backend | Node.js, Express.js | Server-side logic and API creation |
| Database | MongoDB | Store users, slot status, and parking history |
| Authentication | JWT, bcryptjs | Secure login and password handling |
| Styling Upgrade | Tailwind CSS / shadcn UI (if used) | Modern reusable UI system |

---

## 🧠 Why This Project?

This project solves common parking problems such as:

- Uncertainty about slot availability
- Time wasted searching for parking
- Manual parking management
- Lack of user tracking
- No central admin control

It provides a digital solution where users can quickly check parking status and perform actions from one dashboard.

---

## 📂 Folder Structure

| Folder / File | Purpose |
|---|---|
| `frontend/` | Contains UI files |
| `backend/` | Contains server and database logic |
| `index.html` | Main webpage structure |
| `style.css` | Custom design and layout |
| `script.js` | Frontend behavior and button actions |
| `server.js` | Backend entry point |
| `models/` | Database schemas |
| `routes/` | API routes |
| `controllers/` | Business logic |

---

## 🚀 How It Works

| Step | Action |
|---|---|
| 1 | User opens the dashboard |
| 2 | User creates account or logs in |
| 3 | Parking slots are displayed on screen |
| 4 | User clicks Park or Depart |
| 5 | Backend updates slot status |
| 6 | Data is stored in database |

---

## 🔐 Authentication Flow

- User enters name, email, mobile, vehicle number, and password
- Password is hashed before storage
- JWT token is generated after successful login
- Token can be used to verify secured operations

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/slots` | Fetch all slots |
| `POST` | `/api/slots/park/:id` | Mark a slot as occupied |
| `POST` | `/api/slots/depart/:id` | Mark a slot as available |

---

## 🧾 Code Highlights

### Frontend
- `loadSlots()` → Loads slot data from backend and updates UI
- `parkVehicle(id)` → Sends park request to backend
- `depart(id)` → Sends depart request to backend

### Backend
- Express server handles API requests
- MongoDB stores parking data
- Authentication routes manage signup/login
- Slot routes handle parking operations

---

## 🗄️ Database Design

### User Collection
Stores:
- Name
- Email
- Mobile
- Password
- Vehicle Number

### Slot Collection
Stores:
- Slot Number
- Status
- User Info
- Parking Time

### History Collection
Stores:
- Parking start time
- Parking end time
- Vehicle details
- Slot number

---

## 🧩 Future Improvements

| Future Feature | Benefit |
|---|---|
| Admin Dashboard | Monitor all users and slots |
| Parking History | Track previous parking records |
| Reservation System | Book slots in advance |
| Real-Time Updates | Live status using Socket.IO / IoT |
| Mobile App | Better user access |
| Sensor Integration | Auto-detect vehicle presence |

---

## 🖼️ UI Preview

Add your screenshot here:

```md
![Smart Parking UI](assets/screenshot.png)
```

---

## 📚 Learning Outcomes

- Learned full-stack project structure
- Understood frontend-backend connection
- Practiced REST API usage
- Worked with database schema design
- Improved UI/UX design skills
- Learned authentication basics

---

## 🧪 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-parking-system.git

# Move into project folder
cd smart-parking-system

# Install backend dependencies
cd backend
npm install

# Start backend
node server.js
```

---

## ✅ Run the Project

| Part | Command |
|---|---|
| Backend | `node server.js` |
| Frontend | Open `index.html` in browser |

---

## 🤝 Contributing

Contributions are welcome.  
You can improve:
- UI design
- Backend logic
- Admin panel
- Database integration
- IoT sensor support

---

## 👨‍🎓 Author

**Mohammad Faiz**  
B.Tech CSE Student  
Passionate about Web Development, Full Stack Systems, and Smart City Projects

---

## ⭐ Star the Repo

If you like this project, consider starring the repository.
