import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema
const StreamIdSchema = z.object({
  streamId: z.string().uuid(), // Ensuring it's a valid UUID
});

export async function DELETE(
  req: NextRequest,
  context: { params: { streamId: string } } // Fix: Extract params correctly
) {
  try {
    const { streamId } = context.params; // Access params properly

    if (!streamId) {
      return NextResponse.json(
        { message: "Stream ID is required" },
        { status: 400 }
      );
    }

    // Validate streamId using Zod
    const validation = StreamIdSchema.safeParse({ streamId });
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid Stream ID" },
        { status: 400 }
      );
    }

    // Get logged-in user session
    const session = await getServerSession();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existingStream = await prismaClient.stream.findUnique({
      where: { id: streamId },
      include: { user: true }, // Include user to verify ownership
    });

    if (!existingStream) {
      return NextResponse.json(
        { message: "Stream not found" },
        { status: 404 }
      );
    }

    // Only the creator (stream's user) can delete
    if (existingStream.user.email !== userEmail) {
      return NextResponse.json(
        { message: "Forbidden: Not the owner" },
        { status: 403 }
      );
    }

    // Delete the stream from the database
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
