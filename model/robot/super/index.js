class UsperIndex {
    getUser = ({
      name = "xiuxian@2.0.0",
      dsc = "xiuxian@2.0.0",
      event = "message",
      priority = 400,
      rule,
    }) => {
      return { name, dsc, event, priority, rule };
    };
  }
  export default new UsperIndex();