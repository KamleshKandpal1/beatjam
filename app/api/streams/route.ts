import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// @ts-expect-error: Necessary to bypass type-checking for 'youtube-search-api' due to missing types.
import youtubesearchapi from "youtube-search-api";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYT = data.url.match(YT_REGEX);
    if (!isYT) {
      return NextResponse.json(
        {
          message: "Error while adding a stream",
        },
        {
          status: 411,
        }
      );
    }

    const extractedId = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log(res.title);
    console.log(res.thumbnail.thumbnails);

    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: res.title ?? "Can't find Title",
        smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png",
        bigImg:
          thumbnails[thumbnails.length - 1].url ??
          "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png",
      },
    });

    return NextResponse.json({
      message: "Stream Added",
      id: stream.id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });
  return NextResponse.json({
    streams,
  });
}
