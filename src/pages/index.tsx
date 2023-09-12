import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import { NewTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const;

export default function Home() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");

  const session = useSession();

  useEffect(() => {
    console.log("Selected tab = ", selectedTab);
  }, [selectedTab]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mx-4 pb-2 text-lg font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow bg-gray-100 p-2 hover:bg-gray-300 focus-visible:bg-gray-300 ${
                    selectedTab == tab
                      ? "border-b-4 border-blue-500 bg-gray-300 font-bold"
                      : ""
                  }`}
                  onClick={(e) => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <NewTweetForm />
      {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
    </>
  );
}

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage ? tweets.hasNextPage : false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

function FollowingTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <InfiniteTweetList
        tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
        isError={tweets.isError}
        isLoading={tweets.isLoading}
        hasMore={tweets.hasNextPage ? tweets.hasNextPage : false}
        fetchNewTweets={tweets.fetchNextPage}
      />
    </>
  );
}
