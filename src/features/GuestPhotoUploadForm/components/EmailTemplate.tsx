import { Body, Container, Head, Link, Preview, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import { GuestUploadedImage } from "@spiel-wedding/types/Photo";

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
};

interface Props {
  firstName: string;
  lastName: string;
  uploadedImages: GuestUploadedImage[];
}

const EmailTemplate = ({ firstName, lastName, uploadedImages }: Props) => {
  const previewText = `${firstName} ${lastName} uploaded images`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText} </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>
            {firstName} {lastName} uploaded {uploadedImages.length} image(s).
          </Text>
          <Link href="zachandsedona.com/weddingPhotos/gallery">View images</Link>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;
