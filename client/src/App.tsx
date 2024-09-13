import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./App.css";
import Diffussion from "@/components/diffusion/Diffusion";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { ReactNode, useEffect, useReducer } from "react";
import { Box } from "@mui/joy";
import {
  DiffusionContext,
  DiffusionDispatchContext,
} from "./context/DiffusionContext";

// Create a client
const queryClient = new QueryClient();

// function ModeSwitcher() {
//   const { mode, setMode } = useColorScheme();
//   const [mounted, setMounted] = React.useState(false);

//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null;
//   }
//   return (
//     <Select
//       variant="soft"
//       value={mode}
//       onChange={(_, newMode) => {
//         setMode(newMode);
//       }}
//     >
//       <Option value="system">System</Option>
//       <Option value="light">Light</Option>
//       <Option value="dark">Dark</Option>
//     </Select>
//   );
// }

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
  return <Box>{children}</Box>;
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
            {/* <ModeSwitcher /> */}
            <Layout>
              <Header>Header</Header>
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
