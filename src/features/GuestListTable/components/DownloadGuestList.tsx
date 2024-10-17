"use client";

import { Button } from "@mantine/core";
import { Group } from "@spiel-wedding/types/Guest";
import { IconDownload } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const DownloadGuestList = ({ groups }: { groups: Group[] }) => {
  const handleDownload = () => {
    let columns: string[] = ["First Name", "Last Name", "Table"];
    const formattedRows = groups
      .flatMap((group) => {
        return group.guests.map((guest) => {
          let formattedRow: Record<string, string> = {};
          formattedRow["First Name"] = guest.firstName;
          formattedRow["Last Name"] = guest.lastName;
          return formattedRow;
        });
      })
      .sort((rowA, rowB) => rowA["Last Name"].localeCompare(rowB["Last Name"]));

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
