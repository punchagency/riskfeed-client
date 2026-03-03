# Redux Store Structure

## Directory Structure
```
store/
├── index.ts           # Store configuration with persistence
├── hooks.ts           # Typed Redux hooks
└── slices/
    ├── authSlice.ts   # Authentication state
    ├── userSlice.ts   # User data state
    └── themeSlice.ts  # Theme state
```

## Store Configuration

### Persistence
- Uses `redux-persist` with localStorage
- Persisted slices: `user`, `theme`
- Non-persisted: `auth` (uses cookies)

### DevTools
- Enabled in development mode only
- Access via Redux DevTools browser extension

## Adding New Slices

1. Create slice file in `slices/` directory
2. Import and add to `rootReducer` in `index.ts`
3. Add to `whitelist` if persistence needed
4. Create custom hook in `hooks/` directory
5. Export types if needed

## Usage

```typescript
// Import typed hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Or use custom hooks
import { useReduxAuth } from '@/hooks/useReduxAuth';
import { useReduxUser } from '@/hooks/useReduxUser';
import { useReduxTheme } from '@/hooks/useReduxTheme';
```
