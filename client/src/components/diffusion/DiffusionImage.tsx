import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
} from "@mui/joy";

type TProps = {
  src: string;
  title: string;
  width: number;
  height: number;
};

export default function Diffussion(props: TProps) {
  return (
    <>
      <Card variant="plain">
        <CardOverflow>
          <AspectRatio ratio={props.width / props.height}>
            <img height={props.height} width={props.width} src={props.src} />
          </AspectRatio>
        </CardOverflow>
        {/* <CardContent>
          <Typography level="title-md">{props.title}</Typography>
        </CardContent> */}
      </Card>
    </>
  );
}
