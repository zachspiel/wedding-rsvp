# Spielberger Wedding Website 💍

[![Made with Supabase](https://supabase.com/badge-made-with-supabase-dark.svg)](https://supabase.com)
![Mantine](https://img.shields.io/badge/Mantine-ffffff?style=for-the-badge&logo=Mantine&logoColor=339af0)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

<img src="./public/assets/images/The-Spielbergers-Wedding-Logo.webp" alt="Spielberger Wedding Logo" height="156">

Welcome to our Wedding RSVP application! This project is built using Next.js, TypeScript, and Supabase to streamline the RSVP process for our upcoming wedding. Guests can easily confirm their attendance and provide additional details.

Admin users can also manage the guest list, update RSVP statuses, events, and modify content on the homepage.

The latest published version of the website can be found at [https://www.zachandsedona.com](https://www.zachandsedona.com)

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/zachspiel/wedding-rsvp.git
```

2. Navigate to the project directory:

```bash
cd wedding-rsvp
```

3. Install dependencies

```bash
yarn install
```

4. Create a Supabase project with a database, authentication, and storage.

5. Go to API settings under project settings. Create a `.env` file in the project root and add your Supabase configuration:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

6. Add the following variables to the `.env` file. These are used to send emails to guests when they RSVP.

```
EMAIL (email that will send mail)
PASS (password for email to send mail)
EMAIL_RECIPIENTS (email that will recieve mail once guests RSVP)
```

## Running the Project

Run the following command to start the app locally:

```bash
yarn dev
```

## Testing

This project uses [vitest](https://vitest.dev) to test various operations on the database (add guests, modify RSVPs, view events, etc.).

```bash
yarn test
```

A coverage report can also be generated with the following command.

```bash
yarn coverage
```

## Project Structure

The structure for this project is based off of [Bulletproof React](https://github.com/alan2207/bulletproof-react). Common components can be found under src/components. Specific features like the guest book or RSVP form can be found under src/features.

```
.
└── src
    ├── app
    │   ├── api
    │   ├── guestList (admin route for managing guest list)
    │   ├── login (public login page)
    │   └── page.tsx
    ├── components
    ├── context
    ├── database
    ├── features
    │   └── [FEATURE]
    │       ├── components
    │       ├── index.tsx
    │       └── styles.module.css
    ├── hooks
    └── types
```

## Database Schema

The current database schema can be found below. This current design allows groups to have any number of guests who can individually RSVP to multiple events.

The other tables (guestbook, faq, gallery) allow admin users to dynamically modify content on the homepage without having to redeploy the project.

![Database Schema](./images/database-schema.png)

## License

This project is licensed under the [MIT License](LICENSE.md).
