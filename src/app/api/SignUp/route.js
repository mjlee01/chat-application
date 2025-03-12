import { pb } from "../../lib/pocketbase";

export async function POST(request) {
  const data =  await request.json()
  console.log(data);
  try {
    const authData = await pb.collection('users').create(data);

    return Response.json(authData);
  }
  catch (e) {
    return Response.json({ error: e.message });
  }
}