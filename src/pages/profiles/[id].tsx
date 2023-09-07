import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import Link from "next/link";
import { ProfileImage } from "~/components/ProfileImage";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import { useSession } from "next-auth/react";
import { Button } from "~/components/Button";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const trpcUtils = api.useContext();

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: async ({ addedFollow }) => {
      await trpcUtils.profile.invalidate();
    },
    onError: ({}) => {},
  });

  return (
    <>
      <Head>
        <title>{`Twitter Clone ${profile.name}`}</title>
      </Head>

      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">
            {profile.name}{" "}
            <span className="text-base font-normal text-gray-500">
              {" "}
              - {profile.tweetsCount} {" tweets."}
            </span>
          </h1>

          <span className="text-gray-500">
            <span>
              Followed by {profile.followersCount}{" "}
              {getPlural(profile.followersCount, "account", "accounts")}. -{" "}
            </span>
            <span>
              Following {profile.followsCount}{" "}
              {getPlural(profile.followersCount, "account", "accounts")}.
            </span>
          </span>
        </div>
        <FollowButton
          isLoading={toggleFollow.isLoading}
          isFollowing={profile.isFollowing}
          userId={id}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage ? tweets.hasNextPage : false}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

type FollowButtonProps = {
  userId: string;
  isFollowing?: boolean;
  isLoading: boolean;
  onClick: () => void;
};

function FollowButton({
  userId,
  isFollowing = false,
  onClick,
  isLoading,
}: FollowButtonProps) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button onClick={onClick} gray={isFollowing} disabled={isLoading}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

const pluratRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluratRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default ProfilePage;
