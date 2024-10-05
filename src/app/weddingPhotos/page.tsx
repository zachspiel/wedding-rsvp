import { Button, Container, Paper, SimpleGrid, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import classes from "./styles.module.css";

export default async function WeddingPhotosPage() {
  return (
    <Container>
      <SimpleGrid cols={1} pb="xl">
        <Title order={2} fw="normal" ta="center">
          Spielberger Wedding Gallery
        </Title>

        <SimpleGrid cols={2}>
          <Paper shadow="md" p="xl" radius="md" className={classes.card}>
            <div>
              <Title order={3} className={classes.title} fw="bold">
                Upload Photos
              </Title>
            </div>
            <Button
              rightSection={<IconArrowRight strokeWidth={1.5} />}
              component="a"
              href="/weddingPhotos/upload"
            >
              Go to upload page
            </Button>
          </Paper>

          <Paper shadow="md" p="xl" radius="md" className={classes.card}>
            <div>
              <Title order={3} className={classes.title}>
                View Gallery
              </Title>
            </div>
            <Button
              rightSection={<IconArrowRight strokeWidth={1.5} />}
              component="a"
              href="/weddingPhotos/gallery"
            >
              Go to gallery page
            </Button>
          </Paper>
        </SimpleGrid>
      </SimpleGrid>
    </Container>
  );
}
