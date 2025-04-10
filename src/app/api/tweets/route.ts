import client from "../../../../lib/appwrite_client";
import { Databases, ID } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function createTweet(data: { message: string; username: string }) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, // ✅ Database ID
            "67e96cb200380da37f4a", // ✅ Collection ID
            ID.unique(), // Document ID
            data // Data to be inserted
        );
        return response;
    } catch (error) {
        throw error;
    }
}

async function getTweets(){
    try {
        const res = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, // Database ID
            "67e96cb200380da37f4a", // Collection ID

        )

        const notes = res.documents.map((doc) => ({
            $id: doc.$id,
            $createdAt: doc.$createdAt,
            message: doc.message,
            username: doc.username,
        }));
        return notes;
    }
    catch (error : any){
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        const { message, username } = await req.json(); // Extract request data

        if (!message || !username) {
            return NextResponse.json(
                { error: "Message and username are required" },
                { status: 400 }
            );
        }

        // Call createTweet to insert the document
        const response = await createTweet({ message, username });

        return NextResponse.json(response, { status: 201 }); // Success response
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create tweet" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request){
    try {
        const notes = await getTweets();
        return NextResponse.json(notes);
    }
    catch (error: any){
        return NextResponse.json(
            { error: error.message || "Failed to create tweet" },
            { status: 500 })
    }
}
