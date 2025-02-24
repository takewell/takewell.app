import { IconLink } from "./IconLink";
import { SITE } from "~/libs/constants";

const resources = [
  { name: "home", href: "/" },
  { name: "x", href: SITE.x },
  { name: "facebook", href: SITE.facebook },
  { name: "mail", href: SITE.email },
  { name: "github", href: SITE.github },
  { name: "zenn", href: SITE.zenn },
  { name: "speakerdeck", href: SITE.speakerdeck },
] as const;

export const SiteNavigation = () => {
  return (
    <nav className="flex">
      <div className="
        flex flex-row gap-4 mx-auto
        fixed bottom-4 left-1/2 transform -translate-x-1/2
        sm:left-8 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:flex-col md:pl-10
        rounded-2xl z-[1]
      ">
        {resources.map(({ href, name }) => (
          <IconLink key={name} name={name} href={href} />
        ))}
      </div>
    </nav>
  );
};
