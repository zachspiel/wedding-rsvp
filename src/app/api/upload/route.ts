import { getDriveServive } from "@spiel-wedding/hooks/googleDrive";
import { GuestPhotoUploadResult } from "@spiel-wedding/types/Photo";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";

const uploadToGooglDrive = async (
  filename: string,
  fileBuffer: Buffer,
  mime: string
): Promise<GuestPhotoUploadResult> => {
  const driveService = getDriveServive();
  const fileMetadata = {
    name: filename,
    parents: [process.env.PARENT_ENV ?? ""],
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: mime,
      body: Readable.from(fileBuffer),
    },
    fields: "id",
  });

  return { docId: response.data.id, success: true };
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file: any = formData.get("file");
  const mime: any = formData.get("mime");
  const filename: any = formData.get("fileName");
  const fileBuffer = file.stream();

  const envVars = [
    "GDRIVE_PROJECTID",
    "GDRIVE_CLIENTID",
    "GEMAIL",
    "GDRIVE_PRIVTKEY",
    "PARENT_ENV",
  ];

  envVars.forEach((variable) => {
    if (!process.env[variable]) {
      console.error(`${variable} not found!`);
      return NextResponse.json({ success: false });
    }
  });

  try {
    const res = await uploadToGooglDrive(filename, fileBuffer, mime);
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
