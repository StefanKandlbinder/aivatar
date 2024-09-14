import Button from "@mui/joy/Button";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Sheet,
  Select,
  Option,
  SelectOption,
  ListItemDecorator,
  Avatar,
} from "@mui/joy";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { TDiffusion } from "@/App";
import HuggingfaceIcon from "@/icons/Huggingface";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

type TFormInput = Omit<TDiffusion, "id" | "data" | "createdAt">;

type TProps = {
  loading: boolean;
  onSubmit: (data: TFormInput) => void;
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
          sx={{ marginLeft: "-3px", marginRight: "11px" }}
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

export default function DiffussionControls(props: TProps) {
  const { control, handleSubmit } = useForm<TFormInput>({
    defaultValues: {
      model: "stable-diffusion-xl",
      prompt: "A cat wearing a suit riding a bike on the moon",
      width: 512,
      height: 512,
      numInferenceSteps: 10,
      seed: 0,
    },
  });

  const onSubmit: SubmitHandler<TFormInput> = (data) => {
    props.onSubmit(data);
  };

  return (
    <form
      style={{ display: "grid", gridArea: "sideleft" }}
      onSubmit={handleSubmit(onSubmit)}
    >
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
                        sx={{ marginLeft: "-4px" }}
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
        <Controller
          name="prompt"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Prompt</FormLabel>
              <Textarea
                size="sm"
                placeholder="Diffuse me..."
                variant="outlined"
                {...field}
              />
            </FormControl>
          )}
        />
        <Controller
          name="width"
          control={control}
          rules={{ required: true, min: 64 }}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Width</FormLabel>
              <Input
                size="sm"
                type="number"
                placeholder="Width..."
                variant="outlined"
                slotProps={{ input: { min: 64 } }}
                {...field}
              />
            </FormControl>
          )}
        />
        <Controller
          name="height"
          control={control}
          rules={{ required: true, min: 64 }}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Height</FormLabel>
              <Input
                size="sm"
                type="number"
                placeholder="Height..."
                variant="outlined"
                slotProps={{ input: { min: 64 } }}
                {...field}
              />
            </FormControl>
          )}
        />
        <Controller
          name="numInferenceSteps"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Inference Steps</FormLabel>
              <Input
                size="sm"
                type="number"
                placeholder="Number of intference steps..."
                variant="outlined"
                slotProps={{ input: { min: 0 } }}
                {...field}
              />
            </FormControl>
          )}
        />
        <Controller
          name="seed"
          control={control}
          rules={{ required: true, min: 0 }}
          render={({ field }) => (
            <FormControl>
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
        <Button
          size="sm"
          startDecorator={<AutoAwesomeRoundedIcon />}
          sx={{ marginTop: 1 }}
          loading={props.loading}
          type="submit"
          variant="outlined"
        >
          Run
        </Button>
      </Sheet>
    </form>
  );
}
