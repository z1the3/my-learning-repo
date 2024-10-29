import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"
import { Button } from "../ui/button"
import CheckIner from "./CheckIner"
import { useEffect, useRef, useState } from "react"
import moment from "moment"
// 组件部署会在服务端加载，访问不到window.location 报错
// 需要设置到客户端渲染
import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from "@docusaurus/useIsBrowser"

export const CheckIn = () => {
  const isBrowser = useIsBrowser();
  if (!isBrowser) {
    return null;
  }

  const CheckInerRef = useRef(new CheckIner())
  const [pageRecord, setPageRecord] = useState()


  useEffect(() => {
    CheckInerRef.current.getPageRecord().then(data => {
      setPageRecord(data)
    })
  }, [])

  const getLastCheckDays = () => {
    const hasRecord = pageRecord?.["hasRecord"]
    return hasRecord ? moment(pageRecord?.["lastCheckInDate"])?.fromNow() : pageRecord?.['text']
  }
  return <BrowserOnly fallback={<div>Loading...</div>}>
    {
      () => <Drawer>
        <DrawerTrigger>打卡</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{`打卡 ${CheckInerRef.current.getCurrentPathname()}`}</DrawerTitle>
            <DrawerDescription>{!pageRecord ? '加载中' :
              getLastCheckDays()}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              size="icon"
              className="h-12 w-12 shrink-0 rounded-full"
              variant="outline"
              onClick={() => {
                CheckInerRef.current.doCheckIn().then((res) => {
                  console.log(res)
                })
              }}
            >打卡</Button>
            {/* <DrawerClose>
            <Button
              variant="outline">取消</Button>
          </DrawerClose> */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    }

  </BrowserOnly>
}
