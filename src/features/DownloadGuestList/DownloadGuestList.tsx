"use client";

import { Button } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import { IconDownload } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

interface Props {
  groups: Group[];
}

const DownloadGuestList = ({ groups }: Props) => {
  const handleDownload = () => {
    const formattedRows = groups.map((group) => {
      let formattedRow: Record<string, string> = group as unknown as any;
      Object.keys(group).map((column) => {
        const key = column as keyof Group;
        if (typeof group[key] === "object" && group[key] !== null) {
          if (key === "guests" && group.guests.length > 0) {
            const { firstName, lastName } = group.guests[0];

            formattedRow[key] = `${firstName} ${lastName}`;
          } else {
            formattedRow[key] = JSON.stringify(formattedRow[key]);
          }
        }
      });
      return formattedRow;
    });

    const csv = Papa.unparse(formattedRows);

    const filename = "Spielberger-Wedding-Guest-List.csv";
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(csvData, filename);
  };

  return (
    <Button leftSection={<IconDownload />} onClick={handleDownload}>
      Export CSV
    </Button>
  );
};

export default DownloadGuestList;
