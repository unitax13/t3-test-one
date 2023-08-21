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

function updateTextAreaSize(textArea?: HTMLTextAreaElement | null) {
  if (textArea == null) {
    return;
  }
  textArea.style.height = "32";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form() {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  const [inputValue, setInputValue] = useState("");

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      console.log(newTweet); //////////////////////
      setInputValue("");
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
        className="mx-4 my-2 flex flex-col gap-2 border-b"
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
