import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import HeartIconFilled from "~/icons/HeartIconFilled";
import WeirdIcon from "~/icons/WeirdIcon";
import HeartOutlined from "~/icons/HeartOutlined";
import HeartFilled from "~/icons/HeartFilled";

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
  hasMore,
  fetchNewTweets,
}: InfiniteTweetListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
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
          loader={"Loading..."}
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
        <HeartButton likedByMe={likedByMe} likeCount={likeCount} />
      </div>
    </li>
  );
}

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
};

function HeartButton({ likedByMe, likeCount }: HeartButtonProps) {
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
    <div className="mb-1 mt-1 flex items-center gap-2 self-start text-gray-500">
      {likedByMe ? <HeartFilled /> : <HeartOutlined />}
      <span> {likeCount}</span>
    </div>
  );
}
