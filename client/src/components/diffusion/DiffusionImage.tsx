import { TDiffusion } from "@/App";
import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
} from "@mui/joy";

type TProps = TDiffusion;

export default function Diffussion(props: TProps) {
  return (
    <>
      <Card variant="plain" sx={{ borderRadius: "xl" }}>
        <CardOverflow>
          <AspectRatio
            ratio={props.width / props.height}
            sx={{ maxWidth: props.width }}
          >
            <img height={props.height} width={props.width} src={props.data} />
          </AspectRatio>
        </CardOverflow>
        {/* <CardContent>
          <Typography level="title-md">{props.title}</Typography>
        </CardContent> */}
      </Card>
    </>
  );
}
