import React from "react";
import { ActionIcon, Badge, Card, Flex, Group, Text, Title } from "@mantine/core";
import { ref, onValue } from "firebase/database";
import { database } from "../database/database";
import { RsvpResonse } from "./RsvpForm";
import csvDownload from "json-to-csv-export";
import { IconDownload } from "@tabler/icons";

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

  const exportToCsv = (): void => {
    const dataToConvert = {
      data: responses,
      filename: "rsvps",
      delimiter: ",",
      headers: ["Attending", "Created At", "Email", "Message", "Song Request"],
    };

    csvDownload(dataToConvert);
  };

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
        <Text sx={{ marginRight: "0.5rem" }}>{totalYesses} Yes</Text>{" "}
        <Text>{responses.length - totalYesses} No</Text>
        <ActionIcon
          variant="filled"
          onClick={(): void => exportToCsv()}
          sx={{ marginLeft: "0.5rem" }}
        >
          <IconDownload size={16} />
        </ActionIcon>
      </Flex>
      {responses.map((response, index) => {
        return (
          <Card shadow="sm" p="lg" radius="md" withBorder key={index}>
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
              {response.songRequest ?? ""}
            </Text>
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
