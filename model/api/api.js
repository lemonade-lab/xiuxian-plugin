import plugin from "../../../../lib/plugins/plugin.js";
import { BotApi } from "./botapi.js";
import { GameApi } from "./gameapi.js";
export { BotApi, GameApi, plugin };
export const Super = ({
  name = "xiuxian",
  dsc = "xiuxian",
  event = "message",
  priority = 400,
  rule,
}) => {
  return { name, dsc, event, priority, rule };
};
