"use client";

import { Button } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import { IconDownload } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

interface Props {
  groups: Group[];
}

const VALID_KEYS = [
  "email",
  "affiliation",
  "address1",
  "address2",
  "city",
  "state",
  "postal",
  "guests",
];

const DownloadGuestList = ({ groups }: Props) => {
  const handleDownload = () => {
    let columns: string[] = [];

    const formattedRows = groups.map((group) => {
      let formattedRow: Record<string, string> = {};

      Object.keys(group)
        .filter((key) => VALID_KEYS.includes(key))
        .map((column) => {
          const key = column as keyof Group;
          if (key === "guests" && group.guests.length > 0) {
            group.guests.forEach((guest, index) => {
              const { firstName, lastName, nameUnknown } = guest;
              const name = nameUnknown ? "Unknown Guest" : `${firstName} ${lastName}`;
              formattedRow[`Guest ${index + 1}`] = name;
            });
          } else {
            formattedRow[column] = group[key] as string;
          }
        });

      if (Object.keys(formattedRow).length > columns.length) {
        columns = Object.keys(formattedRow);
      }

      return formattedRow;
    });

    const csv = Papa.unparse(formattedRows, { columns });
    const filename = "Spielberger-Wedding-Guest-List.csv";
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(csvData, filename);
  };

  return (
    <Button variant="outline" leftSection={<IconDownload />} onClick={handleDownload}>
      Export CSV
    </Button>
  );
};

export default DownloadGuestList;
