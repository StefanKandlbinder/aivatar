import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./App.css";
import Diffussion from "@/components/diffusion/Diffusion";
import { CssVarsProvider, extendTheme, useColorScheme } from "@mui/joy/styles";
import { ReactNode, useEffect, useReducer, useState } from "react";
import { Box, Select, Option, Sheet, SelectOption } from "@mui/joy";
import {
  DiffusionContext,
  DiffusionDispatchContext,
} from "./context/DiffusionContext";
import Brightness2RoundedIcon from "@mui/icons-material/Brightness2";
import LightModeRoundedIcon from "@mui/icons-material/LightMode";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

// Create a client
const queryClient = new QueryClient();

function renderValue(option: SelectOption<string> | null) {
  if (!option) {
    return null;
  }

  let icon;

  switch (option.value) {
    case "system": {
      icon = <SettingsRoundedIcon />;
      break;
    }
    case "light": {
      icon = <LightModeRoundedIcon />;
      break;
    }
    case "dark": {
      icon = <Brightness2RoundedIcon />;
      break;
    }
  }

  return icon;
}

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(_, newMode) => {
        setMode(newMode);
      }}
      renderValue={renderValue}
    >
      <Option value="system">
        <SettingsRoundedIcon />
        System
      </Option>
      <Option value="light">
        <LightModeRoundedIcon />
        Light
      </Option>
      <Option value="dark">
        <Brightness2RoundedIcon />
        Dark
      </Option>
    </Select>
  );
}

const theme = extendTheme({
  cssVarPrefix: "mode-toggle",
});

type TProps = {
  children: ReactNode;
};

function Layout({ children }: TProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateAreas: "'header' 'main'",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "64px auto",
        maxWidth: "1200px",
        width: "100%",
        margin: "auto",
        padding: 2,
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
}

function LayoutControls({ children }: TProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateArea: "controls",
      }}
    >
      {children}
    </Box>
  );
}

function LayoutContent({ children }: TProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateArea: "content" }}>{children}</Box>
  );
}

function LayoutGallery({ children }: TProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateArea: "gallery" }}>{children}</Box>
  );
}

function Header({ children }: TProps) {
  return (
    <Sheet
      sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
    >
      {children}
    </Sheet>
  );
}

export type TDiffusion = {
  id: string;
  createdAt: Date;
  model: string;
  prompt: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  seed: number;
  data: string;
};

export type TDiffusionsAction =
  | { type: "init"; diffusions: TDiffusion[] }
  | { type: "added"; diffusion: TDiffusion }
  | { type: "changed"; diffusion: TDiffusion }
  | { type: "deleted"; id: string };

const initialDiffusions: TDiffusion[] = [];

function diffusionsReducer(
  diffusions: TDiffusion[],
  action: TDiffusionsAction
) {
  switch (action.type) {
    case "init": {
      if (!diffusions.length) {
        const newDiffusions: TDiffusion[] = action.diffusions;
        localStorage.setItem("diffusions", JSON.stringify(newDiffusions));
        return newDiffusions;
      }
      return diffusions;
    }
    case "added": {
      const newDiffusions: TDiffusion[] = [...diffusions, action.diffusion];
      localStorage.setItem("diffusions", JSON.stringify(newDiffusions));
      return newDiffusions;
    }
    case "changed": {
      const newDiffusions = diffusions.map((diffusion) => {
        if (diffusion.id === action.diffusion.id) {
          return action.diffusion;
        } else {
          return diffusion;
        }
      });
      localStorage.setItem("diffusions", JSON.stringify(newDiffusions));
      return newDiffusions;
    }
    case "deleted": {
      const newDiffusions: TDiffusion[] = diffusions.filter(
        (diffusion) => diffusion.id !== action.id
      );
      localStorage.setItem("diffusions", JSON.stringify(newDiffusions));
      return newDiffusions;
    }
  }
}

function App() {
  // const queryClient = useQueryClient()
  const [diffusions, dispatch] = useReducer(
    diffusionsReducer,
    initialDiffusions
  );

  useEffect(() => {
    dispatch({
      type: "init",
      diffusions: JSON.parse(localStorage.getItem("diffusions")),
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DiffusionContext.Provider value={diffusions}>
        <DiffusionDispatchContext.Provider value={dispatch}>
          <CssVarsProvider
            theme={theme}
            modeStorageKey="mode-toggle-demo"
            disableNestedContext
          >
            <Layout>
              <Header>
                <ModeSwitcher />
              </Header>
              <Diffussion></Diffussion>
              {/* <LayoutControls></LayoutControls>
              <LayoutContent>Layout Content</LayoutContent>
              <LayoutGallery>Layout Gallery</LayoutGallery> */}
            </Layout>
          </CssVarsProvider>
        </DiffusionDispatchContext.Provider>
      </DiffusionContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
