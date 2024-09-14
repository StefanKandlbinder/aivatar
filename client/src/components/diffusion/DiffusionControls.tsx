import {
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Select,
  Option,
  SelectOption,
  ListItemDecorator,
  Avatar,
  Slider,
} from "@mui/joy";
import { useForm, Controller, useWatch } from "react-hook-form";
import { TDiffusion } from "@/App";
import HuggingfaceIcon from "@/icons/Huggingface";
import { useEffect } from "react";

export type TControlsFormInput = Omit<
  TDiffusion,
  "id" | "data" | "createdAt" | "prompt" | "negativePrompt"
>;

type TProps = {
  loading: boolean;
  onChange: (data: TControlsFormInput) => void;
};

const modelOptions = [
  { value: "stable-diffusion-xl", label: "Stable Diffusion XL", src: "" },
  { value: "stable-diffusion-v15", label: "Stable Diffusion v1.5", src: "" },
];

function renderValue(option: SelectOption<string> | null) {
  if (!option) {
    return null;
  }

  return (
    <>
      <ListItemDecorator>
        <Avatar
          sx={{ marginLeft: "-2px", marginRight: "11px", width: "24px" }}
          variant="plain"
          size="sm"
        >
          <HuggingfaceIcon />
        </Avatar>
      </ListItemDecorator>
      {option.label}
    </>
  );
}

const widthMarks = [
  { value: 256, label: "256" },
  { value: 512, label: "512" },
  { value: 768, label: "768" },
  { value: 1024, label: "1024" },
];
const inferenceMarks = [
  { value: 1, label: "1" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
];

export default function DiffussionControls(props: TProps) {
  const { control, getValues } = useForm<TControlsFormInput>({
    defaultValues: {
      model: "stable-diffusion-xl",
      width: 640,
      height: 640,
      numInferenceSteps: 10,
      seed: 22,
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    props.onChange(watchedValues as TControlsFormInput);
  }, [watchedValues, props]);

  return (
    <form style={{ display: "grid", gridArea: "sideleft" }}>
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
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Model</FormLabel>
              <Select
                size="sm"
                defaultValue="stable-diffusion-v15"
                {...field}
                renderValue={renderValue}
                onChange={(_, value) => {
                  field.onChange(value, _);
                }}
              >
                {modelOptions.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  >
                    <ListItemDecorator>
                      <Avatar
                        sx={{ marginLeft: "-4px", width: "24px" }}
                        variant="plain"
                        size="sm"
                      >
                        <HuggingfaceIcon />
                      </Avatar>
                    </ListItemDecorator>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
          )}
        ></Controller>
        {/* <Controller
          name="prompt"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl sx={{ marginTop: 1 }}>
              <FormLabel>Prompt</FormLabel>
              <Textarea
                size="sm"
                placeholder="Diffuse me..."
                variant="outlined"
                {...field}
              />
            </FormControl>
          )}
        /> */}
        <Controller
          name="width"
          control={control}
          rules={{ required: true, min: 256 }}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Width: {getValues("width")}</FormLabel>
              <Slider
                min={256}
                max={1024}
                step={64}
                color="neutral"
                disabled={false}
                orientation="horizontal"
                marks={widthMarks}
                valueLabelDisplay="auto"
                slotProps={{
                  markLabel: {
                    sx: {
                      "&[data-index='0']": {
                        transform: "translateX(0%)", // Centers the label above the mark
                      },
                      "&[data-index='3']": {
                        transform: "translateX(-100%)", // Centers the label above the mark
                      },
                      // "& .MuiSlider-markLabel": {
                      //   transform: "translateX(-100%)", // Centers the label above the mark
                      // },
                    },
                  },
                }}
                variant="outlined"
                {...field}
                onChange={(_, value) => {
                  field.onChange(value, _);
                }}
              />
              {/* <Input
                size="sm"
                type="number"
                placeholder="Width..."
                variant="outlined"
                slotProps={{ input: { min: 64 } }}
                {...field}
              /> */}
            </FormControl>
          )}
        />
        <Controller
          name="height"
          control={control}
          rules={{ required: true, min: 64 }}
          render={({ field }) => (
            <FormControl sx={{ marginTop: 4 }}>
              <FormLabel>Height: {getValues("height")}</FormLabel>
              <Slider
                min={256}
                max={1024}
                step={64}
                color="neutral"
                disabled={false}
                orientation="horizontal"
                marks={widthMarks}
                valueLabelDisplay="auto"
                variant="outlined"
                slotProps={{
                  markLabel: {
                    sx: {
                      "&[data-index='0']": {
                        transform: "translateX(0%)", // Centers the label above the mark
                      },
                      "&[data-index='3']": {
                        transform: "translateX(-100%)", // Centers the label above the mark
                      },
                      // "& .MuiSlider-markLabel": {
                      //   transform: "translateX(-100%)", // Centers the label above the mark
                      // },
                    },
                  },
                }}
                {...field}
                onChange={(_, value) => {
                  field.onChange(value, _);
                }}
              />
              {/* <Input
                size="sm"
                type="number"
                placeholder="Height..."
                variant="outlined"
                slotProps={{ input: { min: 64 } }}
                {...field}
              /> */}
            </FormControl>
          )}
        />
        <Controller
          name="numInferenceSteps"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <FormControl sx={{ marginTop: 4 }}>
              <FormLabel>
                Inference Steps: {getValues("numInferenceSteps")}
              </FormLabel>
              <Slider
                min={1}
                max={50}
                step={1}
                color="neutral"
                disabled={false}
                orientation="horizontal"
                marks={inferenceMarks}
                valueLabelDisplay="auto"
                variant="outlined"
                slotProps={{
                  markLabel: {
                    sx: {
                      "&[data-index='0']": {
                        transform: "translateX(0%)", // Centers the label above the mark
                      },
                      "&[data-index='5']": {
                        transform: "translateX(-100%)", // Centers the label above the mark
                      },
                      // "& .MuiSlider-markLabel": {
                      //   transform: "translateX(-100%)", // Centers the label above the mark
                      // },
                    },
                  },
                }}
                {...field}
                onChange={(_, value) => {
                  field.onChange(value, _);
                }}
              />
              {/* <Input
                size="sm"
                type="number"
                placeholder="Number of intference steps..."
                variant="outlined"
                slotProps={{ input: { min: 0 } }}
                {...field}
              /> */}
            </FormControl>
          )}
        />
        <Controller
          name="seed"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <FormControl sx={{ marginTop: 3 }}>
              <FormLabel>Seed</FormLabel>
              <Input
                size="sm"
                type="number"
                placeholder="Seed..."
                variant="outlined"
                slotProps={{ input: { min: 0 } }}
                {...field}
              />
            </FormControl>
          )}
        />
        {/* <Button
          size="sm"
          startDecorator={<AutoAwesomeRoundedIcon />}
          sx={{
            marginTop: 2,
            // backgroundImage:
            //   "linear-gradient(to right bottom, rgba(124, 58, 237, 0.9), rgba(219, 39, 119, 0.9))",
          }}
          loading={props.loading}
          // disabled={props.loading}
          type="submit"
          variant="solid"
        >
          Run
        </Button> */}
      </Sheet>
    </form>
  );
}
