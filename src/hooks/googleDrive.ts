import { google } from "googleapis";

export function getDriveServive() {
  const auth = new google.auth.GoogleAuth({
    scopes: "https://www.googleapis.com/auth/drive",
    projectId: process.env.GDRIVE_PROJECTID,
    credentials: {
      client_id: process.env.GDRIVE_CLIENTID,
      client_email: process.env.GEMAIL,
      private_key: process.env.GDRIVE_PRIVTKEY?.replace(/\\n/g, "\n"),
    },
  });

  return google.drive({ version: "v3", auth: auth });
}
