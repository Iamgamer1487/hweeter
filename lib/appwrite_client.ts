import { Client, Account } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // Add Appwrite API endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string); // Set project ID

const account = new Account(client)
export default client;
export {account}
