# Security Policy

## Supported Versions

Currently supporting the latest version on the main branch.

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < main  | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** create a public GitHub issue
2. Send a detailed report to the repository maintainers via GitHub private message
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Best Practices

When contributing to this project:

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as a template
- Keep API keys and private keys secure

### Smart Contracts
- Follow Solidity best practices
- Be aware of common vulnerabilities:
  - Reentrancy attacks
  - Integer overflow/underflow
  - Front-running
  - Access control issues

### Dependencies
- Regularly update dependencies
- Review security advisories
- Run `npm audit` periodically

### Code Review
- All code must be reviewed before merging
- Security-sensitive changes require extra scrutiny
- Test thoroughly on testnets before mainnet

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help improve our project's security.