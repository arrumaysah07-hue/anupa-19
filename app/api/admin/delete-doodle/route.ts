import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const isAuthenticated = cookieHeader
      .split(";")
      .some(
        (cookie) =>
          cookie.trim() === "admin_session=authenticated"
      );

    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = body?.id;
    const imagePath = body?.image_path;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing doodle ID",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Supabase server credentials.",
        },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(
      supabaseUrl,
      secretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: databaseError } =
      await adminSupabase
        .from("doodles")
        .delete()
        .eq("id", id);

    if (databaseError) {
      console.error(
        "DATABASE DELETE ERROR:",
        databaseError
      );

      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${databaseError.message}`,
        },
        { status: 500 }
      );
    }

    if (imagePath) {
      const { error: storageError } =
        await adminSupabase.storage
          .from("scrapbook-media")
          .remove([imagePath]);

      if (storageError) {
        console.error(
          "STORAGE DELETE ERROR:",
          storageError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              `Doodle deleted, but image deletion failed: ${storageError.message}`,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE DOODLE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}