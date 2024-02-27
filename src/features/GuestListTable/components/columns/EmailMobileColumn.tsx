import { Text } from "@mantine/core";

interface Props {
  email: string;
  phone: string;
}

const EmailMobileColumn = (props: Props): JSX.Element => {
  const { email, phone } = props;

  const createTextElement = (value: string, name: string): JSX.Element => {
    if (value.length === 0) {
      return <Text c="red">Missing {name}</Text>;
    }
    return <Text>{value}</Text>;
  };

  return (
    <>
      {createTextElement(email, "Email")}
      {createTextElement(phone, "Phone")}
    </>
  );
};

export default EmailMobileColumn;
