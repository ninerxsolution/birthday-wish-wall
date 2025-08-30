# 🎂 Birthday Wish Wall

A beautiful and interactive web application where friends can leave birthday wishes, and the birthday person can reply to each wish, creating a personal interaction under each card.

## ✨ Features

- **Public Wish Submission**: Friends can submit birthday wishes without authentication
- **Beautiful Wish Wall**: Grid layout displaying all wishes in elegant cards
- **Reply System**: Birthday person can reply to individual wishes
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Instant display of new wishes and replies
- **Modern UI**: Built with TailwindCSS for a polished look

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Supabase Auth (for future admin features)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- PostgreSQL database

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd birthday-wish-wall
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create a new database or use the default one

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (for Prisma)
DATABASE_URL=your_supabase_database_url
```

### 4. Set Up Database

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Run Database Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Push Schema to Database** (alternative to migration):
   ```bash
   npx prisma db push
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your application.

## 🗄️ Database Schema

The application uses two main tables:

### Wish Table
- `id`: Unique identifier (CUID)
- `name`: Optional sender name
- `message`: Birthday wish message
- `createdAt`: Timestamp
- `isPublic`: Visibility flag

### Reply Table
- `id`: Unique identifier (CUID)
- `wishId`: Foreign key to Wish
- `message`: Reply message
- `createdAt`: Timestamp

## 📱 Usage

### For Friends (Public)
1. Visit `/submit` to leave a birthday wish
2. Fill in your name (optional) and message
3. Submit and see your wish appear on the wall

### For Birthday Person (Admin - Future Feature)
1. Log in with admin credentials
2. View all wishes on the main wall
3. Reply to individual wishes
4. Manage wishes and replies

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── submit/         # Wish submission page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # React components
│   ├── WishWall.tsx    # Main wish wall
│   └── WishCard.tsx    # Individual wish card
└── lib/                # Utility libraries
    ├── prisma.ts       # Prisma client
    └── supabase.ts     # Supabase configuration
```

## 🎨 Customization

### Colors and Themes
The application uses a pink-to-purple gradient theme. You can customize colors in:
- `src/app/globals.css` - Global styles
- Component files - Individual component styling

### Layout and Components
- Modify `src/app/layout.tsx` for header/navigation changes
- Update `src/components/WishCard.tsx` for card design changes
- Customize `src/components/WishWall.tsx` for wall layout

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting (can be added)
- SQL injection protection via Prisma
- XSS protection via React

## 🚧 Future Enhancements

- [ ] Admin authentication system
- [ ] Wish moderation features
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Multiple birthday person support
- [ ] Custom themes and branding
- [ ] Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/yourusername/birthday-wish-wall/issues) page
2. Create a new issue with detailed information
3. Check the Supabase and Prisma documentation

---

Made with ❤️ and 🎂 for special birthdays everywhere!
