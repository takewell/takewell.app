import { RiHome2Fill } from "react-icons/ri";
import {
  SiFacebook,
  SiGithub,
  SiGmail,
  SiSpeakerdeck,
  SiX,
  SiZenn,
} from "react-icons/si";

type IconName = "home" |"github" | "facebook" | "x" | "mail" | "zenn" | "speakerdeck";

type Props = {
  href: string;
  name: IconName;
  className?: string;
};

export const IconLink = ({ href, name, className }: Props) => {
  const iconMap = {
    home: RiHome2Fill,
    mail: SiGmail,
    github: SiGithub,
    facebook: SiFacebook,
    x: SiX,
    zenn: SiZenn,
    speakerdeck: SiSpeakerdeck,
  };

  const IconComponent = iconMap[name];

  return (
    <a
      href={href}
      target={name === "home" ? undefined : "_blank"}
      rel={name === "home" ? undefined : "noopener noreferrer"}
      className={`
        p-3
        rounded-xl
        bg-[#e0e0e0]
        hover:bg-[#f0f0f0]
        transition-all
        duration-300
        shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]
        hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
        flex
        items-center
        justify-center
        ${className}
      `}
    >
      <IconComponent
        className="text-gray-600 size-3 laptop:h-8 laptop:w-8"
      />
    </a>
  );
};
