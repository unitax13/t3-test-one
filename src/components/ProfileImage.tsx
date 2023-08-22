import Image from "next/image";
import AccountIcon from "~/icons/AccountIcon";

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

export function ProfileImage({ src, className = "" }: ProfileImageProps) {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className} bg-red-400`}
    >
      {src == null ? (
        <AccountIcon className="h-full w-full" />
      ) : (
        <Image src={src} alt="profile picture" quality={100} fill />
      )}
    </div>
  );
}
