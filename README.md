# Patriz Wedding Website 💍

[![Made with Supabase](https://supabase.com/badge-made-with-supabase-dark.svg)](https://supabase.com)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

<img src="./public/assets/images/rivera-wedding-logo.webp" alt="Patriz Wedding Logo" height="200">

Welcome to our Wedding RSVP application! This project is built using Next.js, TypeScript, and Supabase to streamline the RSVP process for our upcoming wedding. Guests can easily confirm their attendance and provide additional details.

This project also includes an admin page for managing the guest list, RSVP status updates, and content modification on the homepage.

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

# Running the Project

Run the following command to start the app locally:

```bash
yarn dev
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

## License

This project is licensed under the [MIT License](LICENSE.md).
