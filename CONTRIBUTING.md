# Contributing to On-Chain FDIC Insurance DApp

Thank you for your interest in contributing to the On-Chain FDIC Insurance DApp! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

- Use the GitHub Issues page to report bugs
- Clearly describe the issue including steps to reproduce
- Include relevant logs, screenshots, and system information

### Suggesting Enhancements

- Use GitHub Issues to suggest new features
- Explain the use case and potential implementation
- Discuss with maintainers before implementing major changes

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure everything passes
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

1. Clone the repository
2. Copy `frontend/.env.example` to `frontend/.env` and configure
3. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
4. Run the development server:
   ```bash
   cd frontend && npm start
   ```

### Code Style

- Use consistent indentation (2 spaces for JavaScript/JSX)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Ensure all existing tests pass
- Test manually on Sepolia testnet

### Security

- Never commit API keys or sensitive data
- Report security vulnerabilities privately to maintainers
- Follow smart contract best practices

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Maintain a positive environment

## Questions?

Feel free to open an issue for any questions about contributing.