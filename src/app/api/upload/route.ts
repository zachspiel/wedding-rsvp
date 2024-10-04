import { getDriveServive } from "@spiel-wedding/hooks/googleDrive";
import { NextResponse } from "next/server";
import { Readable } from "nodemailer/lib/xoauth2";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file: any = formData.get("file");
  const mime: any = formData.get("mime");
  const size = parseInt((formData.get("size") as string) || "0");
  const filename: any = formData.get("fileName");
  const fileBuffer = file.stream();

  const envVars = [
    "GDRIVE_PROJECTID",
    "GDRIVE_CLIENTID",
    "GEMAIL",
    "GDRIVE_PRIVTKEY",
    "PARENT_FOLDER",
  ];

  envVars.forEach((variable) => {
    if (!process.env[variable]) {
      console.error(`${variable} not found!`);
      return NextResponse.json({ success: false });
    }
  });

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const driveService = getDriveServive();
  const fileMetadata = {
    name: filename,
    parents: [process.env.PARENT_FOLDER ?? ""],
  };

  driveService.files
    .create(
      {
        requestBody: fileMetadata,
        media: {
          mimeType: mime,
          body: Readable.from(fileBuffer),
        },
        fields: "id",
      },
      {
        onUploadProgress: async (evt) => {
          const progress = (evt.bytesRead / size) * 100;

          await writer.write(
            encoder.encode(
              JSON.stringify({
                progress: {
                  file: filename,
                  progress: Math.round(progress),
                },
              })
            )
          );
        },
      }
    )
    .then(async (response) => {
      await writer.write(
        encoder.encode(JSON.stringify({ progress: { file: filename, progress: 100 } }))
      );

      await writer.write(
        encoder.encode(JSON.stringify({ docId: response.data.id, success: true }))
      );

      await writer.close();
    })
    .catch(async (error) => {
      console.log(error);

      await writer.write(
        encoder.encode(
          JSON.stringify({
            success: false,
          })
        )
      );

      await writer.close();
    });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
