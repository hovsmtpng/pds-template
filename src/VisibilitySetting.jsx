import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { useApp } from "@/hooks/use-app";

function AccessSection({
    title,
    items,
    sectionKey,
    handleChange,
    selectedAccess,
    handleSelectAll,
    handleDeselectAll,
    handleSearch,
}) {
    return (
        <div className="bg-white dark:bg-dark rounded-sm mt-1 p-3 pr-5 sm:max-w-2xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-muted-foreground">
                    {title.toUpperCase()}
                </h3>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={() => handleSelectAll(sectionKey)}
                    >
                        Select All
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                        onClick={() => handleDeselectAll(sectionKey)}
                    >
                        Deselect All
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Input
                type="text"
                placeholder="Search..."
                className="mb-3 w-[35%]"
                onChange={(e) => handleSearch(sectionKey, e.target.value)}
            />

            {/* Content */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full overflow-hidden">
                <ScrollArea className="w-full">
                    <div
                        className="
                            grid gap-x-6 gap-y-2 pr-2
                            grid-cols-1
                            sm:grid-rows-3 sm:grid-flow-col relative
                        "
                        style={{
                            gridAutoColumns: "minmax(240px, 1fr)",
                            width: "max-content",
                            maxWidth: "100%",
                        }}
                    >
                        {items.map((item, index) => {
                            const isChecked =
                                selectedAccess?.some(
                                    (selected) => String(selected.id) === String(item.id)
                                ) || false;

                            const isFirstRowInColumn = index % 3 === 0;
                            const columnIndex = Math.floor(index / 3);

                            return (
                                <div
                                    key={`${sectionKey}-${item.id}`}
                                    className="flex items-center space-x-2 whitespace-nowrap relative pl-4"
                                >
                                    {isFirstRowInColumn && columnIndex > 0 && (
                                        <div
                                            className="absolute left-0 top-0 w-[1px] bg-gray-300 dark:bg-gray-700"
                                            style={{
                                                height: "calc(100% * 3 + 16px)",
                                            }}
                                        />
                                    )}

                                    <Checkbox
                                        id={`${sectionKey}-${item.id}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            handleChange(sectionKey, item, checked)
                                        }
                                    />
                                    <label
                                        htmlFor={`${sectionKey}-${item.id}`}
                                        className="text-sm select-none"
                                    >
                                        {item.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden sm:block">
                        <ScrollBar orientation="horizontal" />
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}


export default function VisibilitySetting({
    modalState,
    closeModal,
    handleSave,
    filteredAccess,
    setFilteredAccess,
    selectedAccess,
    setSelectedAccess,
    handleChange,
    handleSelectAll,
    handleDeselectAll,
    handleSearch,
}) {

    return (
        <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
            <DialogContent
                className="bg-muted p-0 sm:max-w-2xl"
                dir={'ltr'} //rtl
            >
                {modalState.title && (
                    <DialogHeader>
                        <DialogTitle className="pt-6 px-6  text-base">{modalState.title}</DialogTitle>
                        {modalState.description && (
                            <DialogDescription className="px-6">{modalState.description}</DialogDescription>
                        )}
                    </DialogHeader>
                )}
                <ScrollArea className="text-sm h-[480px] mx-1">

                    <AccessSection
                        title="Entity"
                        items={filteredAccess.entity}
                        sectionKey="entity"
                        selectedAccess={selectedAccess?.entity}
                        handleChange={handleChange}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                        handleSearch={handleSearch}
                    />

                    <AccessSection
                        title="Customer Group"
                        items={filteredAccess.customer}
                        sectionKey="customer"
                        selectedAccess={selectedAccess?.customer}
                        handleChange={handleChange}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                        handleSearch={handleSearch}
                    />
                    <AccessSection
                        title="Pool"
                        items={filteredAccess.pool}
                        sectionKey="pool"
                        selectedAccess={selectedAccess?.pool}
                        handleChange={handleChange}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                        handleSearch={handleSearch}
                    />
                    <AccessSection
                        title="Supplier Group"
                        items={filteredAccess.supplier}
                        sectionKey="supplier"
                        selectedAccess={selectedAccess?.supplier}
                        handleChange={handleChange}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                        handleSearch={handleSearch}
                    />
                </ScrollArea>

                <DialogFooter className="px-4 pb-4">
                    {modalState.showCancelButton && (
                        <DialogClose asChild>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                    )}
                    <Button onClick={handleSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}