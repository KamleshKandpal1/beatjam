import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upVoteSchema = z.object({
  streamId: z.string(),
});
export async function Post(req: NextRequest) {
  const session = await getServerSession();

  //   TODO: You can get rid ofo  the db call here
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Error while upvoting",
      },
      {
        status: 403,
      }
    );
  }
  try {
    const data = upVoteSchema.parse(await req.json());
    await prismaClient.upvotes.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }
}
