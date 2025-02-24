import {
  type BlockObjectResponse,
  type RichTextItemResponse,
  type PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { JSX } from "react";

type Props = {
  blocks: (PartialBlockObjectResponse | BlockObjectResponse)[]
}

export function NotionBlocks({ blocks }: Props) {
  const renderBlock = (block: BlockObjectResponse) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p className="mb-4 text-justify break-words [&:not(:lang(en))]:leading-relaxed" lang={detectLanguage(block.paragraph.rich_text)}>
            {block.paragraph.rich_text.map((text, i) => (
              <RichText key={i} text={text} />
            ))}
          </p>
        );

      case "heading_1":
        return (
          <h1 className="text-3xl font-bold mt-8 mb-4" data-oid="8.lw_8:">
            {block.heading_1.rich_text.map((text, i) => (
              <RichText key={i} text={text} data-oid="cc.l_a0" />
            ))}
          </h1>
        );

      case "heading_2":
        return (
          <h2 className="text-2xl font-bold mt-6 mb-4" data-oid="8i5bm3h">
            {block.heading_2.rich_text.map((text, i) => (
              <RichText key={i} text={text} data-oid="v0v-:d2" />
            ))}
          </h2>
        );

      case "heading_3":
        return (
          <h3 className="text-xl font-bold mt-4 mb-2" data-oid="zn0btql">
            {block.heading_3.rich_text.map((text, i) => (
              <RichText key={i} text={text} data-oid="eimdwvf" />
            ))}
          </h3>
        );

      case "bulleted_list_item":
        return (
          <li className="ml-4" data-oid="oc1d2ha">
            {block.bulleted_list_item.rich_text.map((text, i) => (
              <RichText key={i} text={text} data-oid="_:uj7wm" />
            ))}
          </li>
        );

      case "numbered_list_item":
        return (
          <li className="ml-4" data-oid="44p7s5t">
            {block.numbered_list_item.rich_text.map((text, i) => (
              <RichText key={i} text={text} data-oid="ble4ron" />
            ))}
          </li>
        );

      case "code":
        return (
          <pre
            className="bg-gray-100 p-4 rounded-lg overflow-x-auto"
            data-oid="53v8s4r"
          >
            <code data-oid="feku50_">
              {block.code.rich_text.map((text) => text.plain_text).join("")}
            </code>
          </pre>
        );

      case "image": {
        const imageUrl =
          block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;

        return (
          <figure className="my-4" data-oid="tzz82t7">
            <img
              src={imageUrl}
              alt={block.image.caption?.map((c) => c.plain_text).join("") || ""}
              className="rounded-lg"
              data-oid="edeq3fx"
            />

            {block.image.caption && block.image.caption.length > 0 && (
              <figcaption
                className="text-center text-sm text-gray-600 mt-2"
                data-oid="81eadpc"
              >
                {block.image.caption.map((c) => c.plain_text).join("")}
              </figcaption>
            )}
          </figure>
        );
      }

      case "quote":
        return (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 my-4"
            data-oid="11t7wlp"
          >
            {block.quote.rich_text.map((text, i) => (
              <RichText key={i} text={text} data-oid="2.zbqr-" />
            ))}
          </blockquote>
        );

      default:
        return null;
    }
  };

  const renderBlocks = (blocks: BlockObjectResponse[]) => {
    const content: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let listType: "bulleted" | "numbered" | null = null;

    blocks.forEach((block, index) => {
      if (
        block.type === "bulleted_list_item" ||
        block.type === "numbered_list_item"
      ) {
        const currentListType =
          block.type === "bulleted_list_item" ? "bulleted" : "numbered";

        if (listType !== currentListType && listItems.length > 0) {
          content.push(
            listType === "bulleted" ? (
              <ul
                key={`list-${index}`}
                className="list-disc my-4"
                data-oid="w-dja1t"
              >
                {listItems}
              </ul>
            ) : (
              <ol
                key={`list-${index}`}
                className="list-decimal my-4"
                data-oid=".ayowtd"
              >
                {listItems}
              </ol>
            ),
          );
          listItems = [];
        }

        listType = currentListType;
        listItems.push(renderBlock(block) as JSX.Element);

        if (index === blocks.length - 1) {
          content.push(
            listType === "bulleted" ? (
              <ul
                key={`list-${index}`}
                className="list-disc my-4"
                data-oid="kf:.6gi"
              >
                {listItems}
              </ul>
            ) : (
              <ol
                key={`list-${index}`}
                className="list-decimal my-4"
                data-oid="44z3vkv"
              >
                {listItems}
              </ol>
            ),
          );
        }
      } else {
        if (listItems.length > 0) {
          content.push(
            listType === "bulleted" ? (
              <ul
                key={`list-${index}`}
                className="list-disc my-4"
                data-oid="brq:pvm"
              >
                {listItems}
              </ul>
            ) : (
              <ol
                key={`list-${index}`}
                className="list-decimal my-4"
                data-oid="ot.69y1"
              >
                {listItems}
              </ol>
            ),
          );
          listItems = [];
          listType = null;
        }
        const renderedBlock = renderBlock(block);
        if (renderedBlock) {
          content.push(
            <div key={block.id} data-oid=":9t8m3u">
              {renderedBlock}
            </div>,
          );
        }
      }
    });

    return content;
  };

  return (
    <div className="notion-content" data-oid="nexokb3">
      {renderBlocks(blocks as BlockObjectResponse[])}
    </div>
  );
}

interface RichTextProps {
  text: RichTextItemResponse;
}

function RichText({ text }: RichTextProps) {
  if (!text) return null;

  let content: string | JSX.Element = text.plain_text;

  if (text.href) {
    return (
      <a
        href={text.href}
        className="text-blue-600 hover:underline"
        data-oid="t_g3fo2"
      >
        {content}
      </a>
    );
  }

  if (text.annotations.bold) {
    content = <strong data-oid="gnig8lw">{content}</strong>;
  }
  if (text.annotations.italic) {
    content = <em data-oid="1a81v1k">{content}</em>;
  }
  if (text.annotations.strikethrough) {
    content = <del data-oid="jarzfc:">{content}</del>;
  }
  if (text.annotations.underline) {
    content = <u data-oid="n_pp9ap">{content}</u>;
  }
  if (text.annotations.code) {
    content = (
      <code className="bg-gray-100 px-1 rounded" data-oid="nc7qt76">
        {content}
      </code>
    );
  }

  return <>{content}</>;
}

function detectLanguage(richText: RichTextItemResponse[]): string {
  // 簡易的な日本語検出（漢字やひらがな、カタカナを含むかどうか）
  const text = richText.map(t => t.plain_text).join('');
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(text) ? 'ja' : 'en';
}
