import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import TextareaAutosize from "react-textarea-autosize";
import { api } from "~/utils/api";

function Form() {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  const [inputValue, setInputValue] = useState("");

  const trpcUtils = api.useContext();

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      // console.log(newTweet); //////////////////////
      setInputValue("");

      if (session.status !== "authenticated") {
        return;
      }

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createTweet.mutate({ content: inputValue });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-4 flex flex-col gap-2 border-b py-2"
      >
        <div className="my-2 flex gap-4">
          <ProfileImage src={session.data.user.image} />
          <TextareaAutosize
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="Co tam słychać, mordo?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {/* <textarea
            ref={inputRef}
            style={{ height: 32 }}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="Co tam słychać, mordo?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></textarea> */}
        </div>
        {/* <div className="flex justify-around"> */}
        <Button className="self-end">Tweet</Button>
        {/* </div> */}
      </form>
    </>
  );
}

export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
}
