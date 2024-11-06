"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieStore = cookies();
  const answerCookie = cookieStore.get("answer");
  const answer = answerCookie?.value ?? "default prompt text";
  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 },
    );
  }

  const data = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  };
  console.log(data);

  const tokenResponse = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  const accessToken = tokenResponse.data.access_token;
  cookieStore.set("token", accessToken);
  console.log(accessToken, "\n");

  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  const resData = await response.json();
  const id = resData.sub;

  console.log(answer);

  const finalAnswer = JSON.parse(answer);
  console.log(finalAnswer);

  // let formattedAnswer = '';
  // try {
  //   const answerFormat = await fetch("https://linkedin-backend-green.vercel.app/format", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ output: answer }),
  //   });

  //   const result = await answerFormat.json();
  //   formattedAnswer = result.output;
  //   console.log(formattedAnswer);
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: "Error formatting answer" },
  //     { status: 500 },
  //   );
  // }

  const imageResponse = await fetch(
    "https://linkedin-backend-green.vercel.app/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `This is the text for my LinkedIn post: ${finalAnswer}; 
          generate an abstract wallpaper-like image for this`,
      }),
    },
  );
  console.log("This is the image response\n");
  console.log(imageResponse);
  if (!imageResponse.ok) {
    throw new Error("Failed to generate image\n");
  }

  const image = await imageResponse.arrayBuffer();
  console.log("This is the image\n");
  console.log(image);

  const registerResponse = await fetch(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${id}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    },
  );

  if (!registerResponse.ok) {
    throw new Error("Failed to register image upload\n");
  }

  const regData = await registerResponse.json();
  const uploadUrl =
    regData?.value?.uploadMechanism?.[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;
  const asset = regData?.value?.asset;

  console.log("These are the upload url and the asset\n");
  console.log(uploadUrl, "\n", asset, "\n");

  const imageBuffer = image;
  const blob = new Blob([imageBuffer], { type: 'application/octet-stream' });

 const actualImage = await fetch(uploadUrl, {
    body: blob,
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  console.log(actualImage.status);

  if (!actualImage.ok) {
    throw new Error(`Image upload failed with status: ${actualImage.status}`);
  }

  if (!actualImage.ok) {
    throw new Error("Image upload failed");
  }
  
  const postData = {
    "author": `urn:li:person:${id}`,
    "lifecycleState": "PUBLISHED",
    "specificContent": {
        "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
                "text": finalAnswer
            },
            "shareMediaCategory": "NONE",
        },
    },
    "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    },
};

  const postResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: "POST",
    body: JSON.stringify(postData),
  });
  console.log("This is the final post response");
  console.log(postResponse);
  const resp = await postResponse.json();
  console.log(resp);
  return NextResponse.redirect("http://ec2-54-253-233-237.ap-southeast-2.compute.amazonaws.com");
}
