"use server";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const state = uuidv4(); // Generate random state for security
  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;

  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=${state}&scope=profile%20email%20w_member_social%20openid&client_id=${linkedinClientId}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl); // Redirect to LinkedIn OAuth
}
