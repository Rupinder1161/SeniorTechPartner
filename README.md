# SeniorTech Referral Partner

An Expo, React Native, and TypeScript app for SeniorTech referral partners. The mobile client talks to a REST API; it never connects directly to MongoDB.

## Run Locally

```sh
cd mobile
npm install
cp .env.example .env
npm start
```

Scan the Expo QR code with Expo Go on an iPhone. To run an iOS simulator, use `npm run ios` on macOS with Xcode installed. The iOS app configuration and native modules are ready for an Expo development build.

The default `EXPO_PUBLIC_USE_MOCK_API=true` uses the isolated mock repository. Mock sign-in accepts any valid email and password. To connect a backend, set `EXPO_PUBLIC_USE_MOCK_API=false` and `EXPO_PUBLIC_API_URL` to the REST API base URL, then implement the endpoints below. Never put secrets or database credentials in Expo public environment variables.

## Checks

```sh
cd mobile
npm run typecheck
npm test
```

## Structure

```text
mobile/
	app/                 Expo Router auth, tabs, detail, and notification routes
	components/          Shared accessible UI and dialogs
	constants/           SeniorTech color and spacing tokens
	hooks/               TanStack Query hooks and query keys
	mockData/            Development-only sample responses
	providers/           Query client and secure auth state
	services/            Axios API client, REST services, mock repository
	types/               API/domain contracts
	utils/               Formatting, validation, and friendly errors
```

Screens call typed service/query hooks, not Axios or mock data directly. Financial totals are mock API responses, not values calculated in UI. Replace the mock service branches with the backend contract while keeping screen query keys and return types stable.

## REST Contract

The API client attaches the Expo SecureStore token as a Bearer token and clears the local session on HTTP 401. Configure a trusted HTTPS URL for production. Expected endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Sign in, return `{ user, token }` |
| POST | `/api/auth/register` | Register a partner, return `{ user, token }` |
| POST | `/api/auth/logout` | Revoke the current session |
| POST | `/api/auth/forgot-password` | Request a password reset |
| POST | `/api/auth/change-password` | Change the current password |
| GET | `/api/dashboard` | Partner, authoritative earnings, referral stats, recent referrals |
| GET, POST | `/api/referrers` | List referrals and submit a referral |
| GET | `/api/referrers/:id` | Partner-visible referral details and timeline |
| GET | `/api/earnings/summary` | Authoritative total, paid, approved, and pending amounts |
| GET | `/api/earnings/history` | Commission history |
| GET, PATCH | `/api/profile` | Read or update partner details (role is immutable) |
| GET | `/api/notifications` | Partner notifications |
| POST | `/api/notifications/device-token` | Register an Expo push token |

The provided Express `server.js` mounts `/api/appointments`, `/api/customers`, `/api/auth`, and `/api/referrers`. The app now adds `/api` in the Axios base URL. Dashboard, earnings, profile, and notification routes must also be implemented in one of those routers or mounted by the backend; the `server.js` snippet alone does not establish those routes or their request/response shapes. Confirm the actual endpoint methods and payloads in each route file before using non-mock mode.

Referral lifecycle status (`pending`, `contacted`, `booked`, `completed`, `approved`, `paid`, `rejected`, `cancelled`) and commission status (`pending`, `approved`, `paid`, `rejected`) are independent fields. The backend owns every commission amount and financial aggregate.

## Security and Notifications

`.env` is ignored by Git. Only public configuration such as the API base URL belongs in `EXPO_PUBLIC_*`; never add JWT signing keys, API private keys, or MongoDB credentials to the app. Auth tokens are stored using Expo SecureStore, never AsyncStorage.

Expo Notifications permission and token registration are scaffolded. Push delivery requires a physical device, Expo/EAS project configuration, and a backend implementation of `/notifications/device-token`; the in-app notification list works with mock data.
