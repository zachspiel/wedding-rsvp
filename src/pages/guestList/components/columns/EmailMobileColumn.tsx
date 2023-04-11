import React from "react";
import { Text } from "@mantine/core";

interface Props {
  email: string;
  phone: string;
}

const EmailMobileColumn = (props: Props): JSX.Element => {
  const { email, phone } = props;

  return (
    <>
      <Text c={email.length === 0 ? "dimmed" : ""}>
        {email.length === 0 ? "No Email" : email}
      </Text>
      <Text c={phone.length === 0 ? "dimmed" : ""}>
        {phone.length === 0 ? "No Phone" : phone}
      </Text>
    </>
  );
};

export default EmailMobileColumn;
