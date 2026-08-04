# GDG on Campus - RIT Roorkee

Official website for Google Developer Groups (GDG) on Campus at Roorkee Institute of Technology (RIT), Roorkee. 

Built with Next.js 15, Tailwind CSS, and Firebase.

## Features
- Dynamic Event Registration System
- Authenticated User Profiles (Google Sign-in)
- Admin Dashboard for managing event attendees
- Responsive, modern UI

## Setup Instructions for Teammates

To run this project locally, follow these exact steps:

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gdgoc-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables (CRITICAL)**
   - Create a file named exactly `.env.local` in the root of the project.
   - Ask the project admin for the Firebase keys, or copy them from your Firebase Console.
   - Paste them into `.env.local` using the format shown in `.env.example`.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   *Note: If you add or change variables in `.env.local` while the server is running, you MUST restart the server (Ctrl+C, then `npm run dev` again) for the changes to take effect!*

## Contributing
Reach out to the core team to get involved!
