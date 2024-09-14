import { useContext, useEffect, useState } from "react";
import {
  Box,
  Divider,
  LinearProgress,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { SubmitHandler } from "react-hook-form";
import DiffusionImage from "./DiffusionImage";
import { v4 as uuidv4 } from "uuid";
// import { useSessionStorage } from "@uidotdev/usehooks";

import {
  DiffusionContext,
  DiffusionDispatchContext,
} from "@/context/DiffusionContext";
import DiffusionImageGallery from "./DiffusionImageGallery";
import DiffussionControls from "./DiffusionControls";
import { TDiffusion } from "@/App";

type TFormInput = Omit<TDiffusion, "id" | "data" | "createdAt">;

export default function Diffussion() {
  // const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<TDiffusion>();

  const diffusions = useContext(DiffusionContext);
  const dispatch = useContext(DiffusionDispatchContext);

  useEffect(() => {
    console.info("Diffusions: ", diffusions);

    if (diffusions.length > 0) {
      setGeneratedImage(diffusions[diffusions.length - 1]);
    }
    // if (diffusionuUrl !== "") {
    //   const eventSource = new EventSource(`api/flux/stream/${diffusionuUrl}`);
    //   eventSource.addEventListener("message", (event) => {
    //     console.log(event);
    //     // const data: string = JSON.parse(event.data);
    //     setGeneratedImage(event.data);
    //   });
    //   eventSource.addEventListener("end", () => {
    //     console.log("Stream ended.");
    //     eventSource.close();
    //   });
    //   return () => {
    //     eventSource.close();
    //   };
    // }
  }, [diffusions]);

  async function fetchDiffusion(url: string, data: TFormInput) {
    try {
      setLoading(true);
      const response = await fetch(`api/flux/${url}`);
      if (!response.ok) {
        setLoading(false);
        throw new Error(`Response status: ${response.status}`);
      }
      const base64Image = await response.text();
      // setGeneratedImage(base64Image);
      dispatch({
        type: "added",
        diffusion: {
          id: uuidv4(),
          createdAt: new Date(),
          model: data.model,
          prompt: data.prompt,
          width: data.width,
          height: data.height,
          numInferenceSteps: data.numInferenceSteps,
          seed: data.seed,
          data: base64Image,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error((error as Error).message);
    }
  }

  const onSubmit: SubmitHandler<TFormInput> = (data) => {
    // setGeneratedImage("")
    const url = `${data.model}/${data.prompt}/${data.numInferenceSteps}/${data.width}/${data.height}/${data.seed}`;

    fetchDiffusion(url, data);
  };

  return (
    <>
      <DiffussionControls onSubmit={onSubmit} loading={loading} />
      <Box sx={{ gridArea: "main" }}>
        <Typography level="h1">Catar here, is that what you want?</Typography>
        <Typography level="body-xs" marginBottom={4}>
          A tool for generative AI that creates beautiful catars
        </Typography>
        <LinearProgress
          determinate
          variant="outlined"
          size="sm"
          color="neutral"
          thickness={24}
          value={Number(12)}
          sx={{
            marginBottom: 2,
            "&::before": {
              backgroundImage:
                "linear-gradient(to right bottom, rgba(124, 58, 237, 0.9), rgba(219, 39, 119, 0.9))",
            },
            "--LinearProgress-radius": "20px",
            "--LinearProgress-thickness": "24px",
          }}
        >
          <Typography
            level="body-xs"
            textColor="common.white"
            sx={{ fontWeight: "xl", mixBlendMode: "difference" }}
          >
            Generating image: {`${Math.round(Number(12))}%`}
          </Typography>
        </LinearProgress>
        {generatedImage !== undefined && (
          <DiffusionImage {...generatedImage}></DiffusionImage>
        )}
        <Box display="grid" marginTop={2} gridTemplateColumns="1fr 1fr" gap={1}>
          <Sheet
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              borderRadius: "sm",
            }}
            variant="soft"
          >
            <Typography color="neutral" level="title-sm">
              Prompt
            </Typography>
            <Divider />
            <Textarea
              sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
              placeholder="What do you want to see..."
              variant="outlined"
              minRows={4}
              size="sm"
            />
          </Sheet>
          <Sheet
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              borderRadius: "sm",
            }}
            variant="soft"
          >
            <Typography color="neutral" level="title-sm">
              Negative Prompt
            </Typography>
            <Divider />
            <Textarea
              size="sm"
              sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
              placeholder="What you don't want to see..."
              variant="outlined"
              minRows={4}
              disabled
            />
          </Sheet>
        </Box>
      </Box>
      <DiffusionImageGallery
        onDelete={(id) => {
          dispatch({
            type: "deleted",
            id: id,
          });
        }}
        diffusions={diffusions}
      />
    </>
  );
}
