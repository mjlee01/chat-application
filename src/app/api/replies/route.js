import { pb } from '../../lib/pocketbase';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const targetId = searchParams.get('messageId');
    try {
        const replies = await pb.collection('replies').getFullList({
            filter: `message = "${targetId}"`,
            expand: 'user',
            sort: '-created',
        });
        return Response.json(replies);
    } catch (e) {
        return Response.json({ error: e.message });
    }
}

export async function POST(request) {
    const data = await request.json();
    try {
        const replies = await pb.collection('replies').create(data);
        return Response.json(replies);
    } catch (e) {
        console.log(e.response);
        return Response.json({ error: e.message });
    }
}
