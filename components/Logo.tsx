import clsx from "clsx";
import Image from "next/image";

type Props = {
  gradientSize?: string;
  iconSize?: string;
};

export const AppLogo = ({
  gradientSize = "w-16 h-16",
  iconSize = "w-10 h-10",
}: Props) => {
  return (
    <div
      className={clsx(
        "bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center ",
        gradientSize,
      )}
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={40}
        height={40}
        className={clsx(iconSize)}
      />
    </div>
  );
};
