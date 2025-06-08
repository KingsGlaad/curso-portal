import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Student } from "@/types/students";
import { X } from "lucide-react";
import Image from "next/image";

type StudentDrawerProps = {
  student: Student;
  mode: "edit" | "view";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StudentDrawer({
  student,
  open,
  onOpenChange,
}: Omit<StudentDrawerProps, "mode">) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="md:max-w-[50%] h-[100dvh] rounded-none">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold">
                Detalhes do Município
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>
              Visualize as informações detalhadas do município.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="h-[calc(100dvh-120px)]">
            <div className="p-6 space-y-6">
              <div className="flex flex-col space-y-2">
                <Image
                  src={student?.image || "/images/default-profile.jpg"}
                  alt={student?.name || ""}
                  width={400}
                  height={200}
                  className="object-cover rounded-md"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Nome:
                    </h3>
                    <p className="text-lg font-medium">{student?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
