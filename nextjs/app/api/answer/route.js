import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { answer } = await req.json();

    console.log("Received answer:", answer);

    const response = NextResponse.json({ message: "done" });

    // Set each cookie individually
    response.cookies.set("answer", JSON.stringify(answer), {
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    });

    return response;
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.error();
  }
}