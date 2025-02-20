import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// @ts-expect-error: Necessary to bypass type-checking for 'youtube-search-api' due to missing types.
import youtubesearchapi from "youtube-search-api";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

// /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

const CreateStreamSchema = z.object({
  url: z.string(),
  email: z.string().email(), // Added email as required
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());

    // Get User ID from User table
    const user = await prismaClient.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.id) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 }
      );
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

    // 🔥 **Check if extractedId already exists**
    const existingStream = await prismaClient.stream.findFirst({
      where: {
        extractedId,
      },
    });

    if (existingStream) {
      return NextResponse.json(
        { message: "Video Already Exists" },
        { status: 400 }
      );
    }

    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log(res);

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
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email query parameter is required" },
        { status: 400 }
      );
    }

    // Get User ID from User table using email
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: { id: true, email: true }, // Select only required fields
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Now get streams using the found user ID
    const streams = await prismaClient.stream.findMany({
      where: { userId: user.id },
      include: { upvotes: true },
    });

    // Format response
    const formattedStreams = streams.map((stream) => ({
      id: stream.id,
      type: stream.type,
      url: stream.url,
      extractedId: stream.extractedId,
      title: stream.title,
      smallImg: stream.smallImg,
      bigImg: stream.bigImg,
      upvotes: stream.upvotes.length, // Count upvotes
      userId: stream.userId,
      user: { email: user.email }, // Only include necessary user data
    }));

    return NextResponse.json(
      {
        streams: formattedStreams,
        message: "Streams fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { message: "Error fetching streams" },
      { status: 500 }
    );
  }
}
