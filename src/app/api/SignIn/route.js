import { pb } from "../../lib/pocketbase";

export async function POST(request) {
  const data =  await request.json()
  try {
    const authData = await pb.collection('users').authWithPassword(
        data.email,
        data.password,
    );

    console.log('ss', authData);
    return Response.json(authData);
  }
  catch (e) {
    return Response.json({ error: e.message });
  }
}
