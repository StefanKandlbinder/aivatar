import { AspectRatio, Box, Sheet, Stack, Typography } from "@mui/joy";
import { TDiffusion } from "@/App";
import dayjs from "dayjs";

type TProps = {
  diffusions: TDiffusion[];
  onDelete: (id: string) => void;
};

export default function DiffusionImageGallery(props: TProps) {
  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        borderRadius: "sm",
        gridArea: "sideright",
      }}
      variant="soft"
    >
      <Typography level="title-sm">Prompt History</Typography>
      {props.diffusions.map((diffusion) => {
        return (
          <Box display="flex" key={diffusion.id} gap={2}>
            <Box
              onClick={() => props.onDelete(diffusion.id)}
              sx={{
                ":hover": { cursor: "pointer" },
                borderRadius: "sm",
                overflow: "hidden",
              }}
            >
              <img
                height={diffusion.height}
                width={diffusion.width}
                src={diffusion.data}
              />
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography level="title-sm">
                {dayjs(diffusion.createdAt).format("DD/MM/YYYY")}
              </Typography>
              <Typography level="body-xs">
                {dayjs(diffusion.createdAt).format("hh:mm:ss")}
              </Typography>
              <Typography level="body-xs">{diffusion.model}</Typography>
            </Box>
          </Box>
        );
      })}
    </Sheet>
  );
}
