import { NewTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-gray-100 pt-2">
        <h1 className="mx-4 pb-2 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm />
    </>
  );
}
