/*Obfuscated by JShaman.com*/ import _0x3186ef from "\u006e\u006f\u0064\u0065\u003a\u0066\u0073";
import _0x490ade from "\u0070\u0061\u0074\u0068";
import { appname } from "\u002e\u002e\u002f\u002e\u002e\u002f\u0061\u0070\u0070\u002e\u0063\u006f\u006e\u0066\u0069\u0067\u002e\u006a\u0073";
export const toIndex = async (_0x26243e) => {
  const _0x58242f = "/snigulp".split("").reverse().join("") + appname;
  const _0x1d1e59 =
    "/.".split("").reverse().join("") + _0x58242f + "\u002f" + _0x26243e;
  const _0x2d7438 = [];
  const _0xf8ec1e = [];
  const _0xe601b2 = (_0xb51206, _0x2a631e) => {
    _0x3186ef[
      "\u0072\u0065\u0061\u0064\u0064\u0069\u0072\u0053\u0079\u006e\u0063"
    ](_0xb51206)["\u0066\u006f\u0072\u0045\u0061\u0063\u0068"]((_0x104d67) => {
      if (
        _0x104d67["\u0073\u0065\u0061\u0072\u0063\u0068"](
          "\u002e\u006a\u0073"
        ) != -(0x64348 ^ 0x64349)
      ) {
        _0x2d7438["\u0070\u0075\u0073\u0068"](
          _0x104d67["\u0072\u0065\u0070\u006c\u0061\u0063\u0065"](
            "sj.".split("").reverse().join(""),
            ""
          )
        );
      }
      let _0x4d20b1 = _0x490ade["\u006a\u006f\u0069\u006e"](
        _0xb51206,
        _0x104d67
      );
      if (
        _0x3186ef["\u0073\u0074\u0061\u0074\u0053\u0079\u006e\u0063"](
          _0x4d20b1
        )[
          "\u0069\u0073\u0044\u0069\u0072\u0065\u0063\u0074\u006f\u0072\u0079"
        ]()
      ) {
        _0xe601b2(_0x4d20b1, _0x2a631e);
      } else {
        _0x2a631e(_0x4d20b1);
      }
    });
  };
  _0xe601b2(_0x1d1e59, (_0xd313eb) => {
    if (
      _0xd313eb["\u0073\u0065\u0061\u0072\u0063\u0068"](
        "sj.".split("").reverse().join("")
      ) != -(0x95a6e ^ 0x95a6f)
    ) {
      _0xf8ec1e["\u0070\u0075\u0073\u0068"](_0xd313eb);
    }
  });
  let _0x421e73 = {};
  for (let _0x4a831c of _0xf8ec1e) {
    let _0x9948f7 =
      "\u002e\u002e\u002f\u002e\u002e" +
      _0x4a831c["\u0072\u0065\u0070\u006c\u0061\u0063\u0065"](/\\/g, "\u002f")[
        "\u0072\u0065\u0070\u006c\u0061\u0063\u0065"
      ](
        "".split("").reverse().join("") + _0x58242f,
        "".split("").reverse().join("")
      );
    let _0x26ee53 = await import(_0x9948f7);
    let _0x1d22be = Object["\u006b\u0065\u0079\u0073"](_0x26ee53);
    _0x1d22be["\u0066\u006f\u0072\u0045\u0061\u0063\u0068"]((_0x411991) => {
      if (
        _0x26ee53[_0x411991][
          "\u0070\u0072\u006f\u0074\u006f\u0074\u0079\u0070\u0065"
        ]
      ) {
        if (
          _0x421e73[
            "\u0068\u0061\u0073\u004f\u0077\u006e\u0050\u0072\u006f\u0070\u0065\u0072\u0074\u0079"
          ](_0x411991)
        ) {
          logger["\u0069\u006e\u0066\u006f"](
            "Template\x20detection:已经存在class\x20" +
              _0x411991 +
              "    \n\u51FA\u5BFC\u540D\u540C".split("").reverse().join("") +
              _0x9948f7
          );
        }
        _0x421e73[_0x411991] = _0x26ee53[_0x411991];
      } else {
        logger["\u0069\u006e\u0066\u006f"](
          "Template\x20detection:存在非class属性" +
            _0x411991 +
            "    \n\u51FA\u5BFC".split("").reverse().join("") +
            _0x9948f7
        );
      }
    });
  }
  return _0x421e73;
};
