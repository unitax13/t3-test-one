import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import HeartOutlined from "~/icons/HeartOutlined";
import HeartFilled from "~/icons/HeartFilled";
import { IconHoverEffect } from "./IconHoverEffect";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  tweets?: Array<Tweet>;
  fetchNewTweets: () => Promise<unknown>;
};

export default function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  hasMore = false,
  fetchNewTweets,
}: InfiniteTweetListProps) {
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div>There was an error. Refresh a page and try again.</div>;
  }

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        There are no tweets.
      </h2>
    );
  }

  return (
    <>
      <ul>
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchNewTweets}
          hasMore={hasMore}
          loader={<LoadingSpinner />}
        >
          {tweets.map((tweet) => {
            return <TweetCard key={tweet.id} {...tweet} />;
          })}
        </InfiniteScroll>
      </ul>
    </>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat("PL-EU", {
  dateStyle: "short",
});

function TweetCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Tweet) {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: async ({ addedLike }) => {
      // it's gonna refetch just the stuff related to tweet.infiniteFeed (if I understand correctly)
      await trpcUtils.tweet.infiniteFeed.invalidate();
      await trpcUtils.tweet.infiniteProfileFeed.invalidate();

      // const updateData: Parameters<
      //   typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      // >[1] = function manualUpdate(oldData) {
      //   //so we can instead manually find the proper tweet to update it
      //   if (oldData == null) return;

      //   const countModifier = addedLike ? 1 : -1;

      //   return {
      //     ...oldData,
      //     pages: oldData.pages.map((page) => {
      //       return {
      //         ...page,
      //         tweets: page.tweets.map((tweet) => {
      //           if (tweet.id === id) {
      //             return {
      //               ...tweet,
      //               likeCount: tweet.likeCount + countModifier,
      //               likedByMe: addedLike,
      //             };
      //           }

      //           return tweet;
      //         }),
      //       };
      //     }),
      //   };
      // };
    },
  });

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className=" text-gray-500">-</span>
          <span className=" text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton
          onClick={handleToggleLike}
          isLoading={toggleLike.isLoading}
          likedByMe={likedByMe}
          likeCount={likeCount}
        />
      </div>
    </li>
  );
}

type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
};

function HeartButton({
  isLoading,
  onClick,
  likedByMe,
  likeCount,
}: HeartButtonProps) {
  const session = useSession();
  if (session.status !== "authenticated") {
    return (
      <>
        {" "}
        <div className="mb-1 mt-1 flex items-center gap-2 self-start text-gray-500">
          <HeartOutlined />
          <span> {likeCount}</span>
        </div>
      </>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group  flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-rose-700"
          : "text-gray-500 hover:text-rose-700 focus-visible:text-rose-700"
      }`}
    >
      {likedByMe ? (
        <span className="my-2">
          <HeartFilled className={` fill-rose-700`} />
        </span>
      ) : (
        <span className="-ml-2">
          <IconHoverEffect red>
            <HeartOutlined className=" fill-gray-500 group-hover:fill-rose-700 group-focus-visible:fill-rose-700" />
          </IconHoverEffect>
        </span>
      )}
      <span>{likeCount}</span>
    </button>
  );
}
