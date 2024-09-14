import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DiffusionImage from "./DiffusionImage";
import { v4 as uuidv4 } from "uuid";
// import { useSessionStorage } from "@uidotdev/usehooks";

import {
  DiffusionContext,
  DiffusionDispatchContext,
} from "@/context/DiffusionContext";
import DiffusionImageGallery from "./DiffusionImageGallery";
import DiffussionControls, { TControlsFormInput } from "./DiffusionControls";
import { TDiffusion } from "@/App";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

type TFormInput = {
  prompt: string;
  negativePrompt: string;
};

export default function Diffussion() {
  // const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<TDiffusion>();
  const [diffusionControls, setDiffusionControls] =
    useState<TControlsFormInput>();

  // const [justify, setJustify] = useState("flex-start");
  const { control, handleSubmit } = useForm<TFormInput>({
    defaultValues: {
      prompt: "A cat wearing a suit riding a bike on the moon",
      negativePrompt: "",
    },
  });

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

  async function fetchDiffusion(
    url: string,
    data: TControlsFormInput & TFormInput
  ) {
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
          data: base64Image,
          ...data,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error((error as Error).message);
    }
  }

  const onChange: SubmitHandler<TControlsFormInput> = (data) => {
    setDiffusionControls(data);
  };

  const onHandleSubmit: SubmitHandler<TFormInput> = (data) => {
    const url = `${diffusionControls!.model}/${data.prompt}/${
      diffusionControls!.numInferenceSteps
    }/${diffusionControls!.width}/${diffusionControls!.height}/${
      diffusionControls!.seed
    }`;

    fetchDiffusion(url, {
      ...(data as TFormInput),
      ...(diffusionControls as TControlsFormInput),
    });
  };

  return (
    <>
      <DiffussionControls onChange={onChange} loading={loading} />
      <Box sx={{ gridArea: "main" }}>
        <Typography level="h1">Catar here, is that what you want?</Typography>
        <Typography level="body-xs" marginBottom={4}>
          A tool for generative AI that creates beautiful catars
        </Typography>
        <LinearProgress
          determinate
          variant="outlined"
          size="sm"
          color="primary"
          thickness={20}
          value={Number(12)}
          sx={{
            marginBottom: 2,
            // "&::before": {
            //   backgroundImage:
            //     "linear-gradient(to right bottom, rgba(124, 58, 237, 0.9), rgba(219, 39, 119, 0.9))",
            // },
            "--LinearProgress-radius": "16px",
            "--LinearProgress-thickness": "20px",
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
        <form onSubmit={handleSubmit(onHandleSubmit)}>
          <Sheet
            variant="soft"
            sx={{
              display: "grid",
              marginTop: 2,
              gap: 2,
              padding: 2,
              gridTemplateColumns: "1fr 1fr",
              borderRadius: "sm",
            }}
          >
            {/* <Box gridColumn="span 2">
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <RadioGroup
                size="sm"
                orientation="horizontal"
                aria-labelledby="segmented-controls-example"
                name="justify"
                value={justify}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setJustify(event.target.value)
                }
                sx={{
                  minHeight: 48,
                  padding: "4px",
                  gap: 2,
                  borderRadius: "12px",
                  bgcolor: "neutral.softBg",
                  "--RadioGroup-gap": "4px",
                  "--Radio-actionRadius": "8px",
                }}
              >
                {["Text to Image", "Image to Image"].map((item) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                  >
                    <TitleRoundedIcon />
                    <Radio
                      key={item}
                      color="neutral"
                      value={item}
                      disableIcon
                      overlay
                      label={item}
                      variant="plain"
                      sx={{ px: 2, alignItems: "center" }}
                      slotProps={{
                        action: ({ checked }) => ({
                          sx: {
                            ...(checked && {
                              bgcolor: "background.surface",
                              // boxShadow: "sm",
                              "&:hover": {
                                bgcolor: "background.surface",
                              },
                            }),
                          },
                        }),
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          </Box> */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: "sm",
              }}
            >
              <Typography color="neutral" level="title-sm">
                Prompt
              </Typography>
              <Divider />
              <Controller
                name="prompt"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Textarea
                    sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                    placeholder="What do you want to see..."
                    variant="outlined"
                    minRows={5}
                    size="sm"
                    {...field}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: "sm",
              }}
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
                minRows={5}
                disabled
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              gridColumn="span 2"
            >
              <Button
                color="primary"
                size="sm"
                sx={{
                  marginTop: 1,
                  width: "max-content",
                }}
                loading={false}
                // disabled={props.loading}
                variant="outlined"
              >
                Reset
              </Button>
              <Button
                size="sm"
                startDecorator={<AutoAwesomeRoundedIcon />}
                sx={{
                  marginTop: 1,
                  width: "max-content",
                  // backgroundImage:
                  //   "linear-gradient(to right bottom, rgba(124, 58, 237, 0.9), rgba(219, 39, 119, 0.9))",
                }}
                loading={false}
                // disabled={props.loading}
                type="submit"
                variant="solid"
              >
                Run
              </Button>
            </Box>
          </Sheet>
        </form>
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
