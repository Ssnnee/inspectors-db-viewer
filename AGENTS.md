# AGENTS.md - Development Guidelines for Inspecteurs App

This document provides comprehensive guidelines for software engineering agents working on the Inspecteurs App, a React TypeScript application for Excel file visualization and styling.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Build, Lint, and Test Commands](#build-lint-and-test-commands)
4. [Code Style Guidelines](#code-style-guidelines)
5. [Architecture Patterns](#architecture-patterns)
6. [File Organization](#file-organization)
7. [Dependencies and Libraries](#dependencies-and-libraries)

## Project Overview

The Inspecteurs App is a React TypeScript application built with Vite that allows users to:
- Upload Excel files (.xlsx, .xls)
- Visualize data in a modern, styled table interface
- Download styled Excel files with proper formatting
- Display statistics and gender-based color coding

## Development Environment Setup

### Prerequisites
- Node.js (latest LTS)
- pnpm package manager
- Git

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```

## Build, Lint, and Test Commands

### Build Commands
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Linting
```bash
# Run ESLint on all files
pnpm lint

# Fix auto-fixable ESLint issues
pnpm lint --fix
```

### Testing
**Note: No test framework is currently configured.** When adding tests:
```bash
# Recommended: Add Vitest for testing
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Run tests (after setup)
pnpm test

# Run single test file
pnpm test path/to/test/file.test.tsx

# Run tests in watch mode
pnpm test --watch
```

### Type Checking
```bash
# TypeScript compilation check
npx tsc --noEmit

# Build with type checking
pnpm build
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled with all strict checks
- **Target**: ES2022
- **Module resolution**: Bundler mode
- **JSX**: React JSX transform
- **Unused variables**: Error on unused locals and parameters
- **Fallthrough cases**: Error on missing break in switch statements

### ESLint Rules
- **TypeScript**: Recommended TypeScript rules
- **React Hooks**: All React hooks rules enabled
- **React Refresh**: Vite-specific React refresh rules
- **Ignored directories**: `dist/`

### Import Organization
```typescript
// 1. React imports first
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import * as XLSX from 'xlsx';

// 3. Local imports (utilities, components, types)
import { normalizeGender } from './utils/genre';
import { parseExcel } from './utils/parseExcel';
```

### Naming Conventions

#### Variables and Functions
- **camelCase**: `fileName`, `handleFileUpload`, `normalizeGender`
- **Boolean variables**: Prefix with `is`, `has`, `can`: `isLoading`, `hasData`, `canUpload`

#### Components
- **PascalCase**: `StyledExcelViewer`, `FileUpload`, `DataTable`

#### Files
- **kebab-case**: `parse-excel.ts`, `genre.ts`, `app.tsx`
- **Index files**: `index.ts` for barrel exports

#### Types and Interfaces
- **PascalCase**: `UserData`, `ExcelRow`, `FileUploadProps`

### Function Declarations
```typescript
// Preferred: Function declarations with explicit return types
export function normalizeGender(value: string): 'male' | 'female' | 'unknown' {
  // implementation
}

// Arrow functions for component props or callbacks
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  // implementation
};
```

### React Patterns

#### Component Structure
```typescript
interface ComponentProps {
  // props interface
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // side effects
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // implementation
  };

  // Render
  return (
    // JSX
  );
};

export default ComponentName;
```

#### Hooks Usage
- Use hooks at the top level of components
- Follow rules of hooks strictly
- Custom hooks for reusable logic
- Proper dependency arrays

### Error Handling
```typescript
try {
  const result = await parseExcel(file);
  // handle success
} catch (error) {
  console.error('Error parsing Excel file:', error);
  // handle error (show user message, fallback, etc.)
}
```

### TypeScript Best Practices
- **Explicit types**: Avoid `any`, use proper type definitions
- **Union types**: Use discriminated unions for related types
- **Generic constraints**: Use generics where appropriate
- **Interface vs Type**: Use interfaces for object shapes, types for unions/primitives

### Styling with Tailwind CSS
- **Utility-first**: Use Tailwind classes directly in JSX
- **Responsive design**: Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Dark mode**: Consider dark mode support if needed
- **Custom gradients**: Use Tailwind's gradient utilities
- **Consistent spacing**: Use Tailwind's spacing scale

## Architecture Patterns

### File Structure
```
src/
├── components/     # Reusable UI components
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── hooks/         # Custom React hooks
├── constants/     # Application constants
├── assets/        # Static assets
└── main.tsx       # Application entry point
```

### Component Patterns
- **Single responsibility**: Each component has one clear purpose
- **Composition over inheritance**: Use composition for component reuse
- **Props drilling avoidance**: Use context or state management for deeply nested props
- **Conditional rendering**: Use early returns for complex conditions

### State Management
- **Local state**: `useState` for component-specific state
- **Derived state**: Compute values from existing state when possible
- **Context**: Use React Context for theme, user preferences, or app-wide state

## File Organization

### Utilities
- Pure functions with clear inputs/outputs
- Well-tested and documented
- Group related functions in modules

### Components
- One component per file (unless very small related components)
- Export default for main component
- Named exports for utilities/types

### Types
- Define interfaces and types near their usage
- Create separate `.d.ts` files for global types
- Use barrel exports (`index.ts`) for clean imports

## Dependencies and Libraries

### Core Dependencies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

### Development Dependencies
- **ESLint**: Code linting with TypeScript and React rules
- **TypeScript ESLint**: TypeScript-specific linting rules
- **React Hooks ESLint**: React hooks rules
- **React Refresh ESLint**: Hot reload rules for Vite

### Excel Processing
- **xlsx**: Excel file parsing and generation library

## Development Workflow

### Before Committing
1. Run linting: `pnpm lint`
2. Run type checking: `npx tsc --noEmit`
3. Build check: `pnpm build`
4. Test (if available): `pnpm test`

### Code Review Checklist
- [ ] TypeScript types are correct and explicit
- [ ] ESLint passes without errors
- [ ] Component follows React best practices
- [ ] Functions are pure where possible
- [ ] Error handling is appropriate
- [ ] Code is well-commented where complex
- [ ] Tests added for new functionality
- [ ] Performance considerations addressed

### Adding New Features
1. Create feature branch
2. Implement with proper types
3. Add tests if applicable
4. Update documentation
5. Run full test suite and linting
6. Create pull request with description

## Security Considerations

- Validate file uploads (type, size, content)
- Sanitize user inputs
- Handle errors gracefully without exposing sensitive information
- Use HTTPS in production
- Keep dependencies updated

## Performance Guidelines

- Use React.memo for expensive components
- Optimize re-renders with proper dependency arrays
- Lazy load components and routes
- Optimize bundle size (tree shaking, code splitting)
- Use proper key props in lists
- Avoid inline functions in render

## Accessibility (a11y)

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Use proper ARIA labels where needed
- Test with screen readers
- Maintain sufficient color contrast

---

*This document should be updated as the project evolves and new patterns emerge.*</content>
<parameter name="filePath">/home/sne/.coding/inspecteurs-app/AGENTS.md