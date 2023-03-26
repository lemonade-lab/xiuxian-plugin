import GameUser from "./index.js";
import listdata from "../data/listdata.js";
import GamePublic from "../public/index.js";
import GameBattle from "../public/battel.js";
import defset from "../data/defset.js";
class duel {
  getDuel = async ({ e, UIDA, UIDB }) => {
    if (!(await GameUser.getUID({ UID: UIDB }))) {
      return `查无此人`;
    }
    if (
      !(await GameUser.existUserSatus({ UID: UIDA })) ||
      !(await GameUser.existUserSatus({ UID: UIDB }))
    ) {
      return `已死亡`;
    }
    const { MSG } = await GamePublic.Go({ UID: UIDA });
    if (MSG) {
      return `${MSG}`;
    }
    const CDID = "11";
    const now_time = new Date().getTime();
    const cf = defset.getConfig({ app: "parameter", name: "cooling" });
    const CDTime = cf.CD.Attack ? cf.CD.Attack : 5;

    const { CDMSG } = await GamePublic.cooling({ UID: UIDA, CDID });
    if (CDMSG) {
      return `${CDMSG}`;
    }
    const actionA = await listdata.listAction({
      NAME: UIDA,
      CHOICE: "user_action",
    });
    const actionB = await listdata.listAction({
      NAME: UIDB,
      CHOICE: "user_action",
    });
    if (actionA.region != actionB.region) {
      return `此地未找到此人`;
    }
    if (actionA.address == 1) {
      const najie_thing = await GameUser.userBagSearch({
        UID: UIDA,
        name: "决斗令",
      });
      if (!najie_thing) {
        return `[修仙联盟]普通卫兵:城内不可出手!`;
      }
      await GameUser.userBag({
        UID: UIDA,
        name: najie_thing.name,
        ACCOUNT: -1,
      });
    }
    await redis.set(`xiuxian:player:${UIDA}:${CDID}`, now_time);
    await redis.expire(`xiuxian:player:${UIDA}:${CDID}`, CDTime * 60);
    const Level = await listdata.listAction({
      NAME: UIDA,
      CHOICE: "user_level",
    });
    Level.prestige += 1;
    await listdata.listAction({
      NAME: UIDA,
      CHOICE: "user_level",
      DATA: Level,
    });
    const user = {
      a: UIDA,
      b: UIDB,
      c: UIDA,
    };
    user.c = await GameBattle.battle({ e, A: UIDA, B: UIDB });
    const LevelB = await listdata.listAction({
      NAME: UIDB,
      CHOICE: "user_level",
    });
    const P = Math.floor(Math.random() * (99 - 1) + 1);
    const MP = LevelB.prestige * 10 + Number(50);
    if (P <= MP) {
      if (user.c != UIDA) {
        user.c = UIDA;
        user.a = UIDB;
        user.b = user.c;
      }
      let bagB = await listdata.listAction({
        NAME: user.b,
        CHOICE: "user_bag",
      });
      if (bagB.thing.length != 0) {
        const thing = await GamePublic.Anyarray({ ARR: bagB.thing });
        bagB.thing = bagB.thing.filter((item) => item.name != thing.name);
        await listdata.listAction({
          NAME: user.b,
          CHOICE: "user_bag",
          DATA: bagB,
        });
        await GameUser.userBag({
          UID: user.a,
          name: thing.name,
          ACCOUNT: thing.acount,
        });
        return `${user.a}夺走了[${thing.name}]*${thing.acount}`;
      }
    }
    return `${user.a}战胜了${user.b}`;
  };
}
export default new duel();
