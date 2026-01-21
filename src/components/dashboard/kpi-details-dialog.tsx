
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export type KPIDetailSection = {
    title: string;
    items: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
};

export type KPIDetailData = {
    title: string;
    value: string;
    formula: string;
    sections?: KPIDetailSection[];
};

type KPIDetailsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    data: KPIDetailData | null;
};

export function KPIDetailsDialog({ isOpen, onClose, data }: KPIDetailsDialogProps) {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{data.title}</DialogTitle>
                    <DialogDescription>
                        Detailed breakdown and calculation method.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold leading-none tracking-tight">Current Value</h4>
                        <p className="text-3xl font-bold text-primary">{data.value}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold leading-none tracking-tight">Calculation Formula</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                            {data.formula}
                        </p>
                    </div>

                    {data.sections && data.sections.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <h4 className="font-semibold leading-none tracking-tight">
                                {section.title}
                            </h4>
                            <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                                <div className="space-y-3">
                                    {section.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm">
                                            <span className="font-medium truncate max-w-[60%]">{item.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">{item.value}</span>
                                                {item.trend === 'up' && <span className="text-green-500">↑</span>}
                                                {item.trend === 'down' && <span className="text-red-500">↓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
