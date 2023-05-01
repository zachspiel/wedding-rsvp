import React from "react";
import { Text } from "@mantine/core";

interface Props {
  email: string;
  phone: string;
}

const EmailMobileColumn = (props: Props): JSX.Element => {
  const { email, phone } = props;

  const createTextElement = (value: string, name: string): JSX.Element => (
    <Text c={value.length === 0 ? "dimmed" : ""}>
      {value.length === 0 ? `No ${name}` : value}
    </Text>
  );

  return (
    <>
      {createTextElement(email, "Email")}
      {createTextElement(phone, "Phone")}
    </>
  );
};

export default EmailMobileColumn;
