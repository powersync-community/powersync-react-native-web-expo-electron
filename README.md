# PowerSync + React Native Web & Electron Demo

This application demonstrates a cross-platform List solution built with React Native Web and Electron, powered by PowerSync and Supabase. It showcases how to use a single React Native codebase to target mobile (iOS/Android), web, and desktop applications while maintaining real-time data synchronization capabilities.

## Get started

### Set up Supabase Project

Detailed instructions for integrating PowerSync with Supabase can be found in the [integration guide](https://docs.powersync.com/integration-guides/supabase-+-powersync). Below are the main steps required to get this demo running.

Create a new Supabase project, and paste and run the contents of [database.sql](./database.sql) in the Supabase SQL editor.

It does the following:

1. Create `lists` and `todos` tables.
2. Create a publication called `powersync` for `lists` and `todos`.
3. Enable row level security and storage policies, allowing users to only view and edit their own data.
4. Create a trigger to populate some sample data when a user registers.

### Set up PowerSync Instance

Create a new PowerSync instance, connecting to the database of the Supabase project. See instructions [here](https://docs.powersync.com/integration-guides/supabase-+-powersync#connect-powersync-to-your-supabase).

Then deploy the following sync rules:

```yaml
bucket_definitions:
  user_lists:
    # Separate bucket per todo list
    parameters: select id as list_id from lists where owner_id = request.user_id()
    data:
      - select * from lists where id = bucket.list_id
      - select * from todos where list_id = bucket.list_id
```

### Configure the app

#### 1. Set up environment variables

Copy the `.env.local.template` file:

```bash
cp .env.local.template .env.local
```

Then edit `.env.local` to insert your Supabase and PowerSync project credentials.

#### 2. Install dependencies

   ```bash
   npm install
   ```

#### 3. Run the App

##### 3.1 Run the Web App

```bash
npm run web
```

##### 3.2 Run the Electron App

This is required for the React Native Web implementation. Learn more in [our docs](https://docs.powersync.com/client-sdk-references/react-native-and-expo/react-native-web-support).

```bash
npx powersync-web copy-assets
```

Then:

```bash
npm run electron:dev
```

##### 3.3 Run the Android App

```bash
npm run android
```

##### 3.4 Run the iOS App

```bash
npm run ios
```

#### ⚠️ Important Electron Runtime Notice

The Electron app in this project is currently configured to run only in development mode with a live server. It cannot run from the statically bundled files (`dist/` folder).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
