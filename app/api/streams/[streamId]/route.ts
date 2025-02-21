import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const StreamIdSchema = z.object({
  streamId: z.string(),
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { streamId?: string } }
): Promise<NextResponse> {
  const streamId = params?.streamId;

  if (!streamId) {
    return NextResponse.json(
      { message: "Stream ID is required" },
      { status: 400 }
    );
  }

  // Validate streamId using Zod
  const validation = StreamIdSchema.safeParse({ streamId });
  if (!validation.success) {
    return NextResponse.json({ message: "Invalid Stream ID" }, { status: 400 });
  }

  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingStream = await prismaClient.stream.findUnique({
      where: { id: streamId },
      include: { user: true },
    });

    if (!existingStream) {
      return NextResponse.json(
        { message: "Stream not found" },
        { status: 404 }
      );
    }

    if (existingStream.user.email !== userEmail) {
      return NextResponse.json(
        { message: "Forbidden: Not the owner" },
        { status: 403 }
      );
    }

    await prismaClient.stream.delete({ where: { id: streamId } });

    return NextResponse.json(
      { message: "Stream Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting stream", error);
    return NextResponse.json(
      { message: "Error deleting Stream" },
      { status: 500 }
    );
  }
}
