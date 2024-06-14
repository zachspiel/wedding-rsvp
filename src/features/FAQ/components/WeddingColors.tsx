import { ColorSwatch, Flex } from "@mantine/core";

const WeddingColors = () => {
  return (
    <Flex w="100%" gap="lg">
      <div>
        <span>Groomsman</span>
        <ColorSwatch color="#343a40" />
      </div>

      <div>
        <span>Bridesmaids</span>
        <ColorSwatch color="#2b8a3e" />
      </div>

      <div>
        <span>Dads</span>
        <ColorSwatch color="#868e96" />
      </div>

      <div>
        <span>Moms</span>
        <ColorSwatch color="#d0bfff" />
      </div>
    </Flex>
  );
};

export default WeddingColors;
