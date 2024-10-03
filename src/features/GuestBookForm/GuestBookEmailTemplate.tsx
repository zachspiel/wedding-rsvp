import { Body, Container, Head, Preview, Text } from "@react-email/components";
import { Html } from "@react-email/html";

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
  guestName: string;
  message: string;
}

const GuestBookMessageTemplate = ({ guestName, message }: Props) => {
  const previewText = `${guestName} left a message in the guest book!`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText} </Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>{message}</Text>
          <Text style={paragraph}>By {guestName}</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default GuestBookMessageTemplate;
