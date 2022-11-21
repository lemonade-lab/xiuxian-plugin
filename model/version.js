import base from './base.js';
export default class Version extends base {
  constructor(e) {
    super(e);
    this.model = 'version';
  };
  getData = async (versionData) => {
    const version =
      (versionData && versionData.length && versionData[0].version);
    let data = {
      ...this.screenData,
      userId: version,
      quality: 100,
      saveId: version,
      versionData: versionData,
    };
    return data;
  };
};