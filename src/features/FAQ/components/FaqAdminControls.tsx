"use client";

import { Center } from "@mantine/core";
import useAdminView from "@spiel-wedding/hooks/adminView";
import { FrequentlyAskedQuestion } from "@spiel-wedding/types/FAQ";
import { IconPlus } from "@tabler/icons-react";
import FaqEditor from "./FaqEditor";
import ModifyFaqOrder from "./ModifyFaqOrder";

interface Props {
  faqs: FrequentlyAskedQuestion[];
}

const FaqAdminControls = ({ faqs }: Props) => {
  const { isAdminViewEnabled } = useAdminView();

  if (!isAdminViewEnabled) {
    return null;
  }

  return (
    <Center>
      <FaqEditor icon={<IconPlus />} label="Add FAQ" />
      <ModifyFaqOrder faqs={faqs} />
    </Center>
  );
};

export default FaqAdminControls;
