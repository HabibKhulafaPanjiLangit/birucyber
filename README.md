# �️ Biru Cyber Security Testing Platform

A comprehensive, interactive web application for learning and testing cybersecurity vulnerabilities. Built with Next.js 15 + TypeScript + Tailwind CSS.

## ✅ **STATUS: ALL FEATURES FULLY FUNCTIONAL**
- 🎯 **6 Security Modules** - All operational
- ✅ **18/18 Tests PASSED** - 100% success rate
- 🔴 **Real-time Monitoring** - Dashboard active
- 📚 **Educational Content** - Complete learning resources

## 🎯 **Available Security Modules**

### 1. 💉 SQL Injection Testing
- ✅ 13+ attack patterns detected
- ✅ Safe vs Vulnerable mode comparison
- ✅ Real data breach simulation
- ✅ Prevention & mitigation guides

### 2. 🔴 Cross-Site Scripting (XSS)
- ✅ 15+ XSS vectors detected
- ✅ Stored, Reflected & DOM-based XSS
- ✅ Real exploit scenarios
- ✅ Sanitization demonstrations

### 3. 🔐 Access Control & Authorization
- ✅ RBAC implementation examples
- ✅ IDOR vulnerability testing
- ✅ Privilege escalation scenarios
- ✅ Bypass technique demonstrations

### 4. 🎭 CSRF Protection ⭐ NEW
- ✅ Token validation testing
- ✅ Session hijacking scenarios
- ✅ Forged request demonstrations
- ✅ Real-world attack examples

### 5. 🔒 Security Headers Analysis ⭐ NEW
- ✅ 7 critical headers scan
- ✅ CSP configuration testing
- ✅ Clickjacking protection
- ✅ Security score calculation

### 6. 🚦 Rate Limiting & Brute Force ⭐ NEW
- ✅ Account lockout mechanism
- ✅ Login attempt tracking
- ✅ Brute force simulation
- ✅ Password crack time estimation

## ✨ Technology Stack

### 🎯 Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Modern UI styling

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

### Option 1: Using Start Script (Recommended)
```bash
# Double-click or run:
start-server.bat
```

### Option 2: Manual Start
```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

### Access the Application
- **Web Interface:** http://localhost:3000
- **API Docs:** See FEATURES.md
- **Quick Tests:** See QUICK-TEST.md

## 🧪 Quick Test

Test all modules with one command:
```powershell
Invoke-RestMethod "http://localhost:3000/api/test-all"
```

**Expected Result:**
```
✅ 18/18 Tests PASSED (100%)
✅ 6 Security Modules Active
```

## 🤖 AI Assistance

This scaffold is designed to work well with any AI-assisted development workflow. Example uses include:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Use your preferred AI assistant or tooling to accelerate development.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🤝 Get Started

1. **Clone this scaffold** to jumpstart your project
2. **Start building** with intelligent code generation and assistance
3. **Deploy with confidence** using the production-ready setup

---

Built with ❤️ for the developer community. Supercharged by AI 🚀
