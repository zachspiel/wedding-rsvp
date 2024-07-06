"use client";

import { ActionIcon, Group, TextInput, rem } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FaqSearchbar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    handleSearch();
  }, [search]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("query", search);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Group p="md">
      <TextInput
        radius="xl"
        w="100%"
        placeholder="Search for question, topic or keyword"
        value={search}
        size="md"
        leftSection={
          <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        }
        rightSection={
          search.length > 0 && (
            <ActionIcon
              size={32}
              radius="xl"
              variant="filled"
              onClick={() => setSearch("")}
            >
              <IconX />
            </ActionIcon>
          )
        }
        onChange={(e) => setSearch(e.target.value)}
      />
    </Group>
  );
};

export default FaqSearchbar;
