# Jadhav Amla Delights - Traditional Amla Products Website

A modern, responsive catalog website for a traditional Amla candy business in Maharashtra, built with Next.js and Tailwind CSS.

## Features

### 🏠 **Home Page**
- Hero section with compelling messaging
- Featured products showcase
- Company story highlight
- Responsive design with smooth animations

### 🛍️ **Products Page**
- Grid layout with detailed product cards
- Product information including ingredients and benefits
- Direct WhatsApp ordering integration
- Mobile-optimized browsing experience

### 📖 **About Page**
- Company history and timeline
- Family business story
- Core values and mission
- Health benefits of Amla

### 📞 **Contact Page**
- Contact form with email integration
- Business information and hours
- Google Maps integration ready
- Multiple contact methods

### 🌐 **Global Features**
- Sticky navigation with smooth scrolling
- Mobile-responsive design
- WhatsApp floating button
- SEO-optimized meta tags
- Social media integration ready

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Responsive**: Mobile-first design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd jadhav-amla-delights
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update the environment variables in \`.env.local\`:
   - \`NEXT_PUBLIC_WHATSAPP_NUMBER\`: Your WhatsApp business number
   - \`CONTACT_EMAIL\`: Email for receiving contact form submissions
   - Other business information

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to \`http://localhost:3000\`

## Configuration

### Products Management
Products are managed in \`lib/products.ts\`. To add/edit products:

1. Open \`lib/products.ts\`
2. Add or modify product objects in the \`products\` array
3. Each product should include:
   - \`id\`: Unique identifier
   - \`name\`: Product name
   - \`description\`: Detailed description
   - \`price\`: Price with currency
   - \`weight\`: Package weight
   - \`image\`: Product image URL
   - \`category\`: Product category
   - \`ingredients\`: List of ingredients
   - \`benefits\`: Array of health benefits

### WhatsApp Integration
The website includes WhatsApp integration for direct ordering:

1. Set \`NEXT_PUBLIC_WHATSAPP_NUMBER\` in your environment variables
2. Format: Country code + number (e.g., 919876543210 for India)
3. Messages are pre-formatted for each product

### Contact Form
The contact form uses a Next.js API route (\`app/api/contact/route.ts\`):

1. Currently logs submissions to console
2. Ready for email service integration
3. Supports services like Resend, SendGrid, or Nodemailer

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Customization

### Branding
- Update logo and colors in \`components/navbar.tsx\`
- Modify color scheme in \`tailwind.config.ts\`
- Replace placeholder images with actual product photos

### Content
- Edit page content in respective page files
- Update business information in \`components/footer.tsx\`
- Modify meta tags in \`app/layout.tsx\`

### Styling
- All styling uses Tailwind CSS
- Custom components in \`components/\` directory
- Responsive breakpoints: sm, md, lg, xl

## Future
- Custom components in `components/` directory
- Responsive breakpoints: sm, md, lg, xl

## Future Enhancements

### E-commerce Features
- **Shopping Cart**: Add cart functionality for multiple items
- **Payment Integration**: Integrate Razorpay for online payments
- **Order Management**: Admin panel for order tracking
- **Inventory Management**: Stock level tracking

### Advanced Features
- **User Accounts**: Customer registration and login
- **Order History**: Track previous purchases
- **Reviews & Ratings**: Customer feedback system
- **Newsletter**: Email marketing integration
- **Multi-language**: Hindi and Marathi language support

### Marketing Features
- **SEO Optimization**: Advanced SEO with structured data
- **Analytics**: Google Analytics integration
- **Social Sharing**: Product sharing on social media
- **Referral Program**: Customer referral system

## File Structure

\`\`\`
jadhav-amla-delights/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── products/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── footer.tsx
│   ├── navbar.tsx
│   └── whatsapp-button.tsx
├── lib/
│   ├── products.ts
│   └── utils.ts
├── .env.example
├── .env.local
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
\`\`\`

## Support

For technical support or customization requests:
- Email: support@jadhavamla.com
- WhatsApp: +91 98765 43210

## License

This project is proprietary software created for Jadhav Amla Delights.

---

**Built with ❤️ for traditional businesses embracing digital transformation**
