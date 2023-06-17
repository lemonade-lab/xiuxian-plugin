import DataIndex, { __PATH } from "../game/data/index.js";
import CreateData from "../game/data/createdata.js";
import DefsetData from "../game/data/defset.js";
import GamePublic from "../game/public/index.js";
import GameUser from "../game/home/user.js";
import Algorithm from "../game/data/algorithm.js";
import UserAction from "../game/home/action.js";
import UserhomeData from "../game/home/data.js";
import Information from "../game/home/information.js";
import Listdata from "../game/public/data.js";
import Schedule from "../game/data/schedule.js";
export const HomeApi = {
  GamePublic,
  __PATH,
  Schedule,
  Listdata,
  GameUser,
  DataIndex,
  DefsetData,
  Algorithm,
  CreateData,
  UserAction,
  UserhomeData,
  Information,
};
