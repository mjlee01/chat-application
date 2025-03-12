import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

pb.authStore.onChange((auth)=> {
  console.log('auth changed', auth);

})

//establish connection to the server (pocketbase)