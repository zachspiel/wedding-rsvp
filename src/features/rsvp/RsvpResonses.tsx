import React from "react";
import { Badge, Card, Flex, Group, Text, Title } from "@mantine/core";
import { ref, onValue } from "firebase/database";
import { database } from "../database/database";
import { RsvpResonse } from "./RsvpForm";

const RsvpResonses = (): JSX.Element => {
  const [responses, setResponses] = React.useState<RsvpResonse[]>([]);
  const totalYesses = responses.filter(
    (response) => response.attending === "Yes!"
  ).length;

  React.useEffect(() => {
    const messagesRef = ref(database, "rsvpResponses/");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setResponses(Object.values(data));
    });
  }, []);

  return (
    <>
      <Title
        order={2}
        size="h1"
        sx={(theme) => ({ fontFamily: `Poppins, sans-serif` })}
        weight={900}
        align="left"
        id="rsvp"
      >
        {responses.length} Responses
      </Title>
      <Flex>
        <Text sx={{ marginRight: "0.5rem" }}>{totalYesses} Yesses</Text>{" "}
        <Text>{responses.length - totalYesses} Nos</Text>
      </Flex>
      {responses.map((response, index) => {
        return (
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>{response.email}</Text>

              {response.attending === "Yes!" && (
                <Badge color="green">{response.attending}</Badge>
              )}
              {response.attending !== "Yes!" && (
                <Badge color="red">{response.attending}</Badge>
              )}
            </Group>

            <Text size="sm" color="dimmed">
              {response.message}
            </Text>
          </Card>
        );
      })}
    </>
  );
};

export default RsvpResonses;
