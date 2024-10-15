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


export const CheckIn = () => {



  return <>
    <Drawer>
      <DrawerTrigger>打卡</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>打卡 '标题'</DrawerTitle>
          <DrawerDescription>你已经xxx天没有访问该页面了</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            variant="outline"
          >打卡</Button>
          <DrawerClose>
            <Button
              variant="outline">取消</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
}
