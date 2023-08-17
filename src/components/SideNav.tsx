import Link from "next/link";

export function SideNav() {
  return (
    <>
      <nav className="sticky top-0 px-2 py-4">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href={`/profiles/`}>Home</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
