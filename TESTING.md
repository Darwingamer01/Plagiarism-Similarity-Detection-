# Testing Guide

This document provides comprehensive instructions for running tests across all services in the plagiarism detection system.

## Overview

The project uses different testing frameworks for each service:
- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest
- **AI Service**: pytest

## Prerequisites

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

### AI Service
```bash
cd ai-service
pip install -r requirements.txt
pip install pytest pytest-cov httpx
```

## Running Tests

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Files Location**: `frontend/src/**/__tests__/**/*.test.tsx`

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Files Location**: `backend/src/__tests__/**/*.test.ts`

**Note**: Backend tests require a PostgreSQL test database. Set environment variables:
```bash
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=plagiarism_test
TEST_DB_USER=postgres
TEST_DB_PASSWORD=postgres
```

### AI Service Tests

```bash
cd ai-service

# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_similarity_checker.py

# Run with verbose output
pytest -v
```

**Test Files Location**: `ai-service/tests/test_*.py`

## Test Coverage

### Current Coverage

- **Frontend**: Unit tests for Button component, authStore, and authService
- **Backend**: Integration tests for auth endpoints, test database setup
- **AI Service**: Unit tests for similarity algorithms and API endpoints

### Coverage Goals

- Minimum 70% code coverage for all services
- 100% coverage for critical paths (authentication, similarity detection)

## Writing New Tests

### Frontend Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Backend Test Example

```typescript
import request from 'supertest'
import app from '../../app'

describe('GET /api/endpoint', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/api/endpoint')
    expect(response.status).toBe(200)
  })
})
```

### AI Service Test Example

```python
def test_similarity_calculation():
    text1 = "Sample text"
    text2 = "Sample text"
    score = calculate_similarity(text1, text2)
    assert score >= 95.0
```

## Continuous Integration

Tests are automatically run on:
- Every commit (via pre-commit hooks)
- Every push (via pre-push hooks)
- Pull requests (via GitHub Actions)

## Troubleshooting

### Frontend Issues

**Problem**: MSW dependency conflicts
**Solution**: Install with `--legacy-peer-deps` flag

**Problem**: Tests timing out
**Solution**: Increase timeout in `vitest.config.ts`

### Backend Issues

**Problem**: Database connection errors
**Solution**: Ensure PostgreSQL is running and test database exists

**Problem**: JWT secret errors
**Solution**: Set `JWT_SECRET` and `JWT_REFRESH_SECRET` environment variables

### AI Service Issues

**Problem**: Import errors
**Solution**: Ensure all dependencies are installed: `pip install -r requirements.txt`

**Problem**: Model not found
**Solution**: Download required models or mock them in tests

## Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Keep tests isolated** - each test should be independent
3. **Use descriptive test names** - clearly state what is being tested
4. **Mock external dependencies** - don't rely on external APIs in tests
5. **Test edge cases** - not just happy paths
6. **Maintain test coverage** - aim for at least 70%
7. **Run tests before committing** - ensure all tests pass

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
