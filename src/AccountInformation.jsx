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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { NewDataTable } from "./components/data-table"
import { Download } from "lucide-react"

export default function AccountInformation({
    open,
    onOpenChange,

    // Table
    columns,
    dataRec,
    sorting,
    pagination,
    searchQuery,
    columnFilters,
    handleSearch,
    handleSorting,
    handlePagination,
    handleColumnFilters,
}) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="bg-muted p-0 sm:max-w-4xl"
                dir={'ltr'} //rtl
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle className="pt-6 px-6 pb-2">ACCOUNT INFORMATION</DialogTitle>
                </DialogHeader>

                <div className="px-6 text-gray-500">
                    DETAIL USER
                </div>

                <div className="px-6">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">NPK</div>
                            <div className="flex-2">20240101</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Division</div>
                            <div className="flex-2">Information Technology</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Username</div>
                            <div className="flex-2">arieftsl</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Department</div>
                            <div className="flex-2">IT Development</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Email</div>
                            <div className="flex-2">arief.basri@puninar.com</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Position</div>
                            <div className="flex-2">UX/UI Officer</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Full Name</div>
                            <div className="flex-2">Arief Feisal Basri</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Level</div>
                            <div className="flex-2">Officer</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Entity</div>
                            <div className="flex-2">Puninar Jaya</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Group</div>
                            <div className="flex-2">Information Technology (Dummy)</div>
                        </div>
                        <div className="flex items-center">
                            <div className="text-gray-500 flex-1">Work Location</div>
                            <div className="flex-2">Nagrak</div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="px-6 text-gray-500">
                    ROLE ASSIGNED
                </div>

                <div className="px-6">
                    <NewDataTable
                        data={dataRec?.roles}
                        sorting={sorting}
                        columns={columns}
                        pagination={pagination}
                        searchQuery={searchQuery}
                        columnFilters={columnFilters}
                        setSorting={handleSorting}
                        setPagination={handlePagination}
                        setSearchQuery={handleSearch}
                        setColumnFilters={handleColumnFilters}
                        config={
                            {
                                pinning: {
                                    left: ["no"],
                                    right: ["action"],
                                },
                                headerSticky: true,
                                columnsPinnable: true,
                                columnsResizable: true,
                                columnsMovable: false,
                                columnsVisibility: false,
                                showColumnsPinnable: true,
                                showPaginationSection: true,
                                showTotalRows: true,
                                showRowPerPage: true,
                                showPageOf: true,
                                showPagination: true,
                            }
                        }
                    />
                </div>

                <DialogFooter className="px-4 pb-4">
                    <DialogClose asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}