import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// @ts-expect-error: Necessary to bypass type-checking for 'youtube-search-api' due to missing types.
import youtubesearchapi from "youtube-search-api";

const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

const CreateStreamSchema = z.object({
  url: z.string(),
  email: z.string().email(), // Added email as required
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());

    // Get User ID from User table
    const user = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isYT = data.url.match(YT_REGEX);
    if (!isYT) {
      return NextResponse.json(
        {
          message: "Invalid YouTube URL",
        },
        {
          status: 400,
        }
      );
    }

    const extractedId = isYT[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);

    // console.log(res.title);
    // console.log(res.thumbnail.thumbnails);

    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const stream = await prismaClient.stream.create({
      data: {
        userId: user.id, // Use the User ID as creatorId
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
      // stream,
    });
  } catch (error) {
    console.error("Error adding video:", error);
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email query parameter is required" },
      { status: 400 }
    );
  }

  // Get User ID from User table using email
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Now get streams using the found user ID
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json({
    streams,
  });
}
