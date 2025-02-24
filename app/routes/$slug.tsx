import { getPage } from "~/libs/notion";
import type { Route } from "./+types/$slug";
import { NotionBlocks } from "~/libs/components/ui/NotionBlocks";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.slug} - takewell.app` }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const cloudflareEnv = context.cloudflare.env;
  try {
    const content = await getPage(params.slug, cloudflareEnv);
    return { content };
  } catch (error) {
    console.error("Error in loader:", error);
    throw new Response("Page not found", { status: 404 });
  }
}

export default function Post(Props: Route.ComponentProps) {
  const { loaderData } = Props;
  const { content } = loaderData;

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
        <div className="text-gray-600">
          <time dateTime={content.date}>
            {content.date.replace(/-/g, ".")}
          </time>
          {/* {content.category && (
                  <span className="ml-4" data-oid="2ijx_10">
                    {content.category}
                  </span>
                )} */}
        </div>
      </header>
      <div
        className="prose prose-lg [&_p]:leading-[1.8] prose-headings:leading-normal"
      >
        <NotionBlocks
          blocks={content.content as BlockObjectResponse[]}
        />
      </div>
    </article>
  );
}
