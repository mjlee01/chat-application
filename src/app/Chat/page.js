"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { pb } from "../lib/pocketbase";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import Comment from "@/components/Comment";

const ChatPage = ({ back, title }) => {
  const router = useRouter();
  const userStore = useUserStore((state) => state.authUser);

  //useState initialization
  //Start here
  const [value, setValue] = useState("");
  const [posts, setPosts] = useState([]);
  const isSubscribed = useRef(false);

  const fetchPosts = async () => {
    //fetch Posts function
    const response = await fetch("http://localhost:3000/api/posts");
    const data = await response.json();
    setPosts(data.items);
  };

  const submitPost = async () => {
    //submit Post function
    const response = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({
        content: value,
        likes: 0,
        user: userStore.id,
      }),
    });
    if (!response.ok) {
        throw new Error('Failed to submit post');
      }
    setValue("");
    await fetchPosts();
  };

  //useEffect for Fetching Messages
  useEffect(() => {
    fetchPosts();
  }, []);

  // /useEffect for Real-Time Updates
  useEffect(() => {
    //Subscribe to real time messages
    if (isSubscribed.current) return; // Prevent duplicate subscriptions
    const unsubscribe = pb.collection("messages").subscribe(
      "*",
      ({ record, action }) => {
        if (action === "create") setPosts((prev) => [record, ...prev]);
      },
      {
        expand: "user",
        sort: "-created",
      }
    );

    return () => {
      unsubscribe.then((unsub) => unsub()); // Cleanup subscription on unmount
      isSubscribed.current = false;
    };
  }, []);

  return (
    <div className="w-full h-screen flex p-6 mt-16">
      <div className="flex flex-col h-full flex-grow">
        {/* HEADER */}
        <header className="absolute top-0 left-0 w-full h-18 bg-white z-10 border-b border-gray-200 flex items-center justify-center md:hidden">
          <div className="flex items-center w-full h-18 px-6">
            {back && (
              <button
                className="btn-stroke btn-square btn-medium shrink-0 mr-6 2xl:mr-4 md:!w-6 md:h-6 md:mr-3"
                onClick={() => router.back()}
              >
                <Icon name="arrow-prev" />
              </button>
            )}
            <h1 className="mr-4 text-h3 truncate">{title || "Chat"}</h1>
            <div className="flex items-center shrink-0 ml-auto">
              <button className="relative hidden w-8 h-8 ml-1 md:block">
                <Image
                  className="rounded-full object-cover"
                  src="/images/avatars/avatar.jpeg"
                  fill
                  alt="Avatar"
                />
              </button>
            </div>
          </div>
        </header>

        {/* USER INFO */}
        <div className="flex items-center">
          <div>
            <div className="relative w-38 h-38 ">
              <Image
                className="rounded-full object-cover"
                src="/images/avatars/avatar.jpeg"
                fill
                alt="Avatar"
              />
            </div>
            <div className="flex text-h3 items-center">
              {userStore && userStore.name}
              <div className="label-stroke ml-2">Designer</div>
            </div>
            <div className="text-sm mb-2">{userStore && userStore.email}</div>
          </div>
        </div>

        <div className="flex shrink-0 w-[30rem] 4xl:w-[14.75rem] gap-2 mb-6">
          {/* styling */}
          <button className="btn-purple btn-medium grow">
            <Icon name="check" />
            <span>Start Chat</span>
          </button>
          {/* styling */}
          <button className="btn-purple btn-medium btn-square shrink-0">
            <Icon name="email"  />
          </button>
          <button
            // styling
            className="btn-purple btn-medium btn-square shrink-0"
            onClick={() => {
              pb.realtime.unsubscribe();
              pb.authStore.clear();
              router.push("/");
            }}
          >
            <Icon name="arrow-up-right" />
          </button>
        </div>

        {/* CHAT INPUT */}
        <div className="flex lg:flex-col-reverse">
          <div className="flex-grow mr-30">
            {/* Comment section  */}
            <Comment
              avatar={'/images/avatars/avatar.jpeg'}
              placeholder="Type to add something"
              value={value}
              setValue={(e) => setValue(e.target.value)}
              posts={posts}
              submitFunc={submitPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
