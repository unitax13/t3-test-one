import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      <nav className="sticky top-0 px-2 py-4">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
          <li>
            <IconHoverEffect>
              <Link href="/">Home</Link>
            </IconHoverEffect>
          </li>
          {user != null ? (
            <li>
              <IconHoverEffect>
                <Link href={`/profiles/${user.id}`}>Profile</Link>
              </IconHoverEffect>
            </li>
          ) : null}
          {user == null ? (
            <li>
              <IconHoverEffect>
                <button onClick={() => void signIn()}> Sign in</button>
              </IconHoverEffect>
            </li>
          ) : (
            <li>
              <IconHoverEffect>
                <button onClick={() => void signOut()}> Sign out</button>
              </IconHoverEffect>
            </li>
          )}
        </ul>
        {/* {user != null ? (
          <>
            <div>
              You are logged in as <p>{user.name}</p>
            </div>
          </>
        ) : null} */}
      </nav>
    </>
  );
}
