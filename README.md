<img src="https://github.com/sarkartanmay393/RoomPay-Web/blob/main/public/icons/pwa-512x512.png?raw=true" style="width:5rem;" />

# RoomPay

## Seemless Room Transactions

FSF is a must-have application tailored for hostel students, allowing them to manage financial transactions effortlessly within their friend groups. The application addresses the common scenario where friends frequently borrow varying amounts from each other, leading to potential misunderstandings and forgotten debts.

### Key Features

1. User-Friendly Interface: A simple and intuitive platform that enables users to keep track of all financial transactions seamlessly.

2. Room Creation: Users can easily create rooms to manage transactions within specific friend groups. The application supports multiple rooms for different social circles.

3. User Management: Add friends to your room by entering their usernames or emails, making tracking transactions with specific individuals easy.

4. Transaction History: Every transaction is recorded in the app, creating a comprehensive history that ensures transparency and accountability.

5. Approval System: Initiate transactions with friends and seek their approval. The intuitive approval system allows users to accept or reject transactions.

6. Statement View: Gain insights into your financial interactions with others in the room. The statement view provides a clear overview of how much you owe or are owed by others.

### How It Works

1. Create a Room: Start by creating a room for your friend group, making it a central hub for financial interactions.

2. Add Users: Easily add friends to your room by entering their usernames or emails, ensuring everyone is on the same page.

3. Initiate Transactions: Record transactions by specifying whether you owe or are owed money, providing clarity for both parties involved.

4. Approval System: Use the approval system to confirm or decline transactions, maintaining accuracy and preventing misunderstandings.

5. Statement View: Explore the statement view to understand your financial relationships within the room, fostering a transparent and harmonious environment.

Join FSF beta today and revolutionize how you manage transactions in your hostel life. Experience a one-stop solution for tracking, approving, and understanding financial interactions with ease. FSF - Every transaction tells a story of shared experiences and financial harmony.`, tell me how it is

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
