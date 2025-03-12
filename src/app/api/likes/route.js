import { pb } from '../../lib/pocketbase';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const messageId = searchParams.get('messageId');
        const userId = searchParams.get('userId');

        if (!messageId || !userId) {
            return Response.json(
                { error: 'Message ID and User ID are required' },
                { status: 400 }
            );
        }

        // Check if this user already liked this message
        const existingLike = await pb
            .collection('likes')
            .getFirstListItem(`message="${messageId}" && user="${userId}"`);
        return Response.json({ liked: !!existingLike });
    } catch (e) {
        return Response.json({ liked: false }); // No like found
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const { message, user } = data;

        if (!message || !user) {
            return Response.json(
                { error: 'Message ID and User ID are required' },
                { status: 400 }
            );
        }

        // Increment likes count in messages collection
        const messages = await pb.collection('messages').getOne(message);
        const updatedMessage = await pb
            .collection('messages')
            .update(message, {
                likes: (messages.likes || 0) + 1,
            });

        // Save the like to prevent duplicates
        await pb.collection('likes').create({
            message: message,
            user: user,
        });                               

        return Response.json(updatedMessage);
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
