import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";
import { themes } from "./utils/theme";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: themes,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
