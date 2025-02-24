import { Client } from "@notionhq/client";
import type{ PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type Page = {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
};

type TitleProperty = {
  type: "title";
  title: Array<{ plain_text: string }>;
};

type RichTextProperty = {
  type: "rich_text";
  rich_text: Array<{ plain_text: string }>;
};

type DateProperty = {
  type: "date";
  date: { start: string };
};

type MultiSelectProperty = {
  type: "multi_select";
  multi_select: Array<{ name: string }>;
};

type NotionProperty = TitleProperty | RichTextProperty | DateProperty | MultiSelectProperty;

const getPropertyValue = (
  property: NotionProperty | undefined,
  type: NotionProperty["type"],
  defaultValue: string | string[] = ""
): string | string[] => {
  if (!property || property.type !== type) return defaultValue;

  switch (type) {
    case "title":
      return (property as TitleProperty).title?.[0]?.plain_text || defaultValue as string;
    case "rich_text":
      return (property as RichTextProperty).rich_text?.[0]?.plain_text || defaultValue as string;
    case "date":
      return (property as DateProperty).date?.start || defaultValue as string;
    case "multi_select":
      return (property as MultiSelectProperty).multi_select?.map(tag => tag.name) || [];
    default:
      return defaultValue;
  }
};

const getEnvironmentVariable = (key: string, cloudflareEnv: Env): string | undefined => {
  if (cloudflareEnv[key as keyof Env]) {
    return cloudflareEnv[key as keyof Env];
  }
  if (typeof process !== 'undefined') {
    return process.env[key] || '';
  }
  return (globalThis as any)[key] || '';
};

const createNotionClient = (cloudflareEnv: Env) => {
  return new Client({
    auth: getEnvironmentVariable('NOTION_API_KEY', cloudflareEnv),
  });
};

export async function getPages(cloudflareEnv: Env): Promise<Page[]> {
  const notion = createNotionClient(cloudflareEnv);
  const databaseId = getEnvironmentVariable('NOTION_DATABASE_ID', cloudflareEnv);

  if (!databaseId) {
    throw new Error("Database ID is not set");
  }

  const response = await notion.databases
    .query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Failed to fetch contents from Notion");
    });

  console.log({ JSON: JSON.stringify(response) })

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => {
      const properties = page.properties;

      return {
        id: page.id,
        title: getPropertyValue(properties.Page as TitleProperty, "title", "Untitled") as string,
        slug: getPropertyValue(properties.Slug as RichTextProperty, "rich_text") as string,
        date: getPropertyValue(properties.Date as DateProperty, "date") as string,
        tags: getPropertyValue(properties.Tags as MultiSelectProperty, "multi_select", []) as string[],
      };
    });
}

export async function getPage(slug: string, cloudflareEnv: Env) {
  const notion = createNotionClient(cloudflareEnv);
  const databaseId = getEnvironmentVariable('NOTION_DATABASE_ID', cloudflareEnv);

  if (!databaseId) {
    throw new Error("Database ID is not set");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug
          }
        },
        {
          property: "Published",
          checkbox: {
            equals: true
          }
        }
      ]
    }
  });

  if (!response.results[0]) {
    throw new Error("Page not found");
  }

  const page = response.results[0];
  if (!("properties" in page)) {
    throw new Error("Invalid page data");
  }

  const properties = page.properties;
  const blocks = await notion.blocks.children.list({ 
    block_id: page.id 
  });

  return {
    title: getPropertyValue(properties.Page as TitleProperty, "title", "Untitled") as string,
    date: getPropertyValue(properties.Date as DateProperty, "date") as string,
    content: blocks.results,
  };
}
