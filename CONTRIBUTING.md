# Contributing to Retire Planner

Thank you for your interest in contributing to Retire Planner! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Browser and OS** information
- **Console errors** if any

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear description** of the enhancement
- **Use cases** for the enhancement
- **Potential implementation** ideas if you have them

## 🛠️ Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/your-username/retire-planner.git
cd retire-planner
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-owner/retire-planner.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📝 Code Style

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### CSS/Tailwind

- Use Tailwind utility classes
- Avoid custom CSS when possible
- Keep responsive design in mind
- Follow mobile-first approach

### Example Component Structure

```jsx
/**
 * Component description
 */
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();

  // Handlers
  const handleClick = () => {
    // logic
  };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

## 🧪 Testing

Before submitting a pull request:

1. **Test locally** - Ensure your changes work as expected
2. **Check responsiveness** - Test on different screen sizes
3. **Validate calculations** - Ensure financial formulas are correct
4. **Check console** - No errors or warnings
5. **Test browsers** - Chrome, Firefox, Safari, Edge

## 📦 Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```
Add feature: Short description

Detailed explanation of the change and why it was made.
```

### Types of Commits

- `Add:` New features
- `Fix:` Bug fixes
- `Update:` Updates to existing features
- `Refactor:` Code refactoring
- `Docs:` Documentation changes
- `Style:` Code style changes (formatting, etc.)
- `Test:` Adding or updating tests
- `Chore:` Maintenance tasks

### Examples

```
Add: export to PDF functionality

Users can now export their retirement plan as a PDF report.

Fix: calculation error in retirement expenses

Corrected the formula for calculating retirement expenses
which was incorrectly using monthly instead of annual values.

Update: improve responsive layout

Enhanced the layout for mobile devices and tablets.
```

## 🌿 Branch Workflow

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `style/` - Style changes
- `test/` - Adding tests

## 🔄 Pull Request Process

1. **Update your branch** with latest main:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request** on GitHub

### PR Description

Include in your PR:

- **Title** - Clear and descriptive
- **Description** - What changes were made and why
- **Screenshots** - For UI changes
- **Related Issues** - Link to any related issues
- **Checklist** - Confirm testing completed

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation if needed
- [ ] No new warnings/errors
- [ ] Tested on multiple browsers
- [ ] Tested responsive design

## 🎨 UI/UX Guidelines

### Design Principles

- **Clarity** - Information should be clear and easy to understand
- **Consistency** - Use consistent colors, fonts, and spacing
- **Accessibility** - Ensure good contrast and readable text
- **Performance** - Keep animations smooth and performant
- **Mobile-first** - Design for smaller screens first

### Color Usage

- **Primary**: Orange for actions and highlights
- **Success**: Green for positive indicators
- **Warning**: Yellow/amber for caution
- **Error**: Red for errors/danger
- **Info**: Blue for informational content

## ❓ Questions?

If you have questions:

1. Check existing issues and discussions
2. Read the documentation
3. Open a new issue with the "question" label

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Accept feedback gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🙏 Recognition

Contributors will be recognized in the README.md file.

Thank you for contributing to Retire Planner! 🎉
