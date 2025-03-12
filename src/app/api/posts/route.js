import { pb } from "../../lib/pocketbase";

export async function GET(request) {
  try {
    const post = await pb.collection('messages').getList(1, 10, {
      sort: '-created',
      expand: 'user',
    });

    return Response.json(post);
  }
  catch (e) {
    return Response.json({ error: e.message });
  }
}

export async function POST(request) {
  const data =  await request.json()
  try {
    const post = await pb.collection('messages').create(data);

    return Response.json(post);
  }
  catch (e) {
    return Response.json({ error: e.message });
  }
}
