import localForage from "localforage";
import moment from "moment";

class CheckIner {
  private allPageRecord: Promise<any>;

  constructor() {
    this.allPageRecord = localForage
      .getItem("__CheckInRecord")
      .then((allPageRecord) => {
        if (!allPageRecord) {
          return localForage.setItem("__CheckInRecord", {});
        } else {
          return allPageRecord;
        }
      });
  }
  public getCurrentPathname = () => {
    const pattern = /^(?:[^\/]*\/){3}(.+)/;
    const match = window.location.pathname.match(pattern);
    return decodeURIComponent(match[1]);
  };

  // 获取当前页面打卡情况：异步操作
  public async getPageRecord() {
    const key = this.getCurrentPathname();
    return this.allPageRecord.then((allPageRecord) => {
      if (allPageRecord[key]) {
        return allPageRecord[key];
      } else {
        return {
          key: this.getCurrentPathname(),
          hasRecord: false,
          text: "未检测到打卡记录",
        };
      }
    });
  }

  // 打卡:异步操作
  public async doCheckIn() {
    const key = this.getCurrentPathname();
    return this.allPageRecord.then((allPageRecord) => {
      if (allPageRecord[key]) {
        // 存在打卡记录
        let raw = allPageRecord[key];
        const currentDate = moment()["_d"];
        const allCheckInDates = raw.allCheckInDates;
        allCheckInDates.push(currentDate);
        raw = {
          ...raw,
          ...{
            lastCheckInDate: currentDate,
            checkInCounter: raw.checkInCounter++,
          },
        };
        allPageRecord[key] = raw;
        return localForage
          .setItem("__CheckInRecord", allPageRecord)
          .then(() => {
            return {
              success: true,
              text: "打卡更新成功！",
            };
          });
      } else {
        // 不存在打卡记录
        const currentDate = moment()["_d"];
        const raw = {
          key,
          hasRecord: true,
          lastCheckInDate: currentDate,
          checkInCounter: 1,
          allCheckInDates: [currentDate],
        };
        allPageRecord[key] = raw;
        return localForage
          .setItem("__CheckInRecord", allPageRecord)
          .then(() => {
            return {
              success: true,
              text: "打卡创建成功！",
            };
          });
      }
    });
  }

  // 打印该页面打卡信息
  public async logRecord() {
    const pageRecord = await this.getPageRecord();
    console.log(pageRecord);
  }
}

export default CheckIner;
