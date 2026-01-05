# Task Management Practice

- Task Management Application

### Features

- User can sign up and sign in
- User can create a project
- User can add members into the project
- Each project contains multiple tasks
- User can assgin a member for each task
- User in the project can create, view, edit, remove, archive project
- User in the project can create, view, edit, remove, archive task
- Unauthorized user can view project and task through public routes

## How to run

### Prerequisites

Make sure you install packages with correct version below:
  - [node v18.18.2+](https://nodejs.org/en/download/package-manager)
  - [pnpm 9.1.2+](https://pnpm.io/installation)

- **Note:**:
    - Please add `.env` into root of project source code, refer `.env.sample`.

Check and update config image hosting on `next.config.mjs` file follow [Next.js document](https://nextjs.org/docs/messages/next-image-unconfigured-host)

### Get source code

| Command                                                                                              | Action                    |
| :----------------------------------------------------------------------------------------------------| :------------------------ |
| `git clone --depth=1 git@gitlab.asoft-python.com:ngoc.nguyenquang/pair-practice.git pair-practice`   | Clone Repository with SSH |
| `$ cd pair-practice`                                                                                 | Redirect to folder        |

### Build and Run app

| Command            | Action                                        | Port                  |
| :----------------- | :---------------------------------------------|:--------------------- |
| `$ pnpm install`   | Install packages dependencies                 | N/A                   |
| `$ pnpm build`     | Build app with optimized production mode      | N/A                   |
| `$ pnpm start`     | Starts the application in production mode.    | http://localhost:3000 |
| `$ pnpm dev`       | Run the app in development mode               | http://localhost:3000 |
| `$ pnpm storybook` | Run Storybook.                                | http://localhost:6006 |
| `$ pnpm test`      | Run Unit Test                                 | N/A                   |
| `$ pnpm coverage`  | Generate code coverage                        | N/A                   |

### Project structure
```shell
.
├── README.md                       # README file
├── .husky                          # Husky configuration
├── .storybook                      # Storybook folder
├── .vscode                         # VSCode configuration
├── public                          # Public assets folder
├── src
|   ├── action                      # Handle server actions (forms)
│   ├── api                         # Handle data with API: GET, POST, PUT, DELETE
│   ├── app                         # Next.js App (App Router)
│   ├── components                  # React components
│   ├── configs                     # Configs folder
│   ├── constants                   # App constants
│   ├── db                          # db folder (handle firestore)
│   ├── hocs                        # HOCs folder
│   ├── hooks                       # Hooks folder
│   ├── icons                       # Icons folder
│   ├── models                      # Model type definitions
│   ├── types                       # Type definitions
│   ├── ui                          # React components by feature
│   ├── utils                       # Utilities folder
├── middleware                      # middleware
├── .eslintrc.json                  # ESLint configuration
├── .lintstagedrc                   # Lint-stage
├── .prettierrc                     # Prettier configuration
├── jest.config.ts                  # Jest configuration
├── next.config.mjs                 # Next.js configuration
├── next.config.mjs                 # Next.js configuration
├── postcss.config.mjs              # Post CSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```
