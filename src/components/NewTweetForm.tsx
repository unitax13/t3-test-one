import { Button } from "./Button";

export function NewTweetForm() {
  return (
    <>
      <form className="mx-4 my-2 flex flex-col gap-2 border-b">
        NEW
        <div className="flex justify-around gap-4">
          {/* <ProfileImage src="#url" /> */}
          <textarea
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="Co tam słychać, mordo?"
          ></textarea>
        </div>
        <div className="flex justify-around">
          <Button>Tweet</Button>
        </div>
      </form>
    </>
  );
}
