import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if(!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET!")
    }
    
    // Get the headers
    const headerPayload = headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)
    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400,
        })
    }

    const eventType = evt.type

    if (eventType === "user.created") {
       await db.insert(user).values({
            externalUserId: payload.data.id,
            username: payload.data.username,
            imageUrl: payload.data.image_url,
            email: payload.data.email_addresses[0].email_address,
            createdAt: payload.data.created_at
       })
    }

    if (eventType === "user.updated") {
        // Fetch the user from the database
        const currentUser = await db.select()
            .from(user)
            .where(eq(user.externalUserId, payload.data.id));

        // Check if the user exists
        if (currentUser.length === 0) {
            return new Response("User not found", {status: 404});
        }

        // Update the user details
        await db.update(user)
            .set({
                username: payload.data.username,
                imageUrl: payload.data.image_url
            })
            .where(eq(user.externalUserId, payload.data.id));

        return new Response("User updated", {status: 200});
    }

    if (eventType === "user.deleted") {
        await db.delete(user).where(eq(user.externalUserId, payload.data.id))
        return new Response("User deleted", {status: 200})
    }
 

    return new Response('', { status: 200 })

}