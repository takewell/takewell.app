import { getPages } from "~/libs/notion";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "takewell.app" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const cloudflareEnv = context.cloudflare.env;
  try {
    const contents = await getPages(cloudflareEnv);
    const data = contents.map(({ title, slug, date, tags }) => ({
      title,
      href: slug,
      date: date.replace(/-/g, "."),
      tags,
    }));

    return {
      data,
    };
  } catch (error) {
    console.error("Error in loader:", error);
    throw new Response("Failed to load contents", { status: 500 });
  }
}

export default function Home(Props: Route.ComponentProps) {
  const { loaderData } = Props;
 const { data } = loaderData;

  return (
    <>
      <div className="p-1 laptop:p-2">
        <img
          className="tablet:size-16 w-12 h-12 rounded-full"
          src="/takei.jpg"
          alt="yuya takei avatar"
        />
      </div>
      <div className="p-1 laptop:p-2">
        <p className="text-2xl laptop:text-4xl tablet:text-3xl text-black font-semibold">
          @takewell
        </p>
        <p className="pl-2 laptop:text-2xl tablet:text-xl text-gray-400 font-semibold">
          yuya takei
        </p>
      </div>
      <div className="p-1 laptop:p-2">
        <header className="font-mono text-gray-500 flex items-center text-xs">
          <span className="w-16 py-3">date</span>
          <span className="grow pl-4">title</span>
          <span className="w-[140px]">tags</span>
        </header>
        <ul className="desktop:max-h-96 laptop:max-h-72 tablet:max-h-48 max-h-72 overflow-y-auto border-t border-gray-200 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
          {data.map(({ href, date, title, tags }, index) => (
            <li key={title}>
              <a href={href}>
                <span
                  className={`flex transition-[background-color] hover:bg-gray-300 active:bg-gray-200 border-b border-gray-200 ${
                    index === data.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <span className="py-3 flex grow items-center">
                    {data && (
                      <span className="text-xs w-16 inline-block shrink-0 text-gray-500">
                        {date}
                      </span>
                    )}
                    <span className="pl-4 grow text-[14px]">
                      {title}
                    </span>
                    <span className="flex flex-wrap gap-1 w-[140px] items-center justify-start">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600 border border-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
                
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
