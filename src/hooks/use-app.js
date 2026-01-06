import { useState, useEffect, useCallback, useMemo } from "react"
import { apiCall } from "../api/apiService"
import * as Icon from "lucide-react"
import OdongIcon from "@/assets/OdongIcon"

// Local Storage
import {
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
} from "@puninar-logistics/pds-sdk";

// Pages
import Dashboard from "@/pages/Dashboard"
import Welcome from "@/pages/Welcome"

// Default
import { NotFound } from "@puninar-logistics/pds-sdk"
import { NotAssigned } from "@puninar-logistics/pds-sdk";
import { UnderMaintenance } from "@puninar-logistics/pds-sdk"

import { withAppContext } from "@puninar-logistics/pds-sdk";

import { useNavigate } from "react-router-dom"
import { useDialog } from "@/providers/AlertDialogProvider"
import { set } from "zod"

import StatusIndicator from "@/components/status-indicator"

const componentRoute = {
    Dashboard,
    UnderMaintenance,
    Welcome
}

export function useApp({ role, auth, modules, lobby, userRole = [] }) {
    const columnsAccountInformation = useMemo(() => [
        {
            accessorKey: "no",
            id: "no",
            header: 'No',
            enableSorting: false,
            enableHiding: false,
            size: 55,
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "role_name",
            id: "role_name",
            header: 'Role Name',
            enableSorting: false,
        },
        {
            accessorKey: "effective_from",
            id: "effective_from",
            header: 'Start Date',
            enableSorting: false,
        },
        {
            accessorKey: "effective_to",
            id: "effective_to",
            header: 'End Date',
            enableSorting: false,
        },
        {
            accessorKey: "status",
            id: "status",
            header: 'Status',
            enableSorting: false,
            enableHiding: false,
            size: 90,
            cell: ({ row }) => {
                return (
                    <StatusIndicator
                        label={row.original.status}
                        active={row.original.status === "ACTIVE"}
                        pulse={row.original.status === "ACTIVE"}
                    />
                )
            },
        }
    ])

    const [dataRecAccountInformation, setDataRecAccountInformation] = useState({
        roles: [],
        user: null,
    })
    const [columnFiltersAccountInformation, setColumnFiltersAccountInformation] = useState([])
    const [searchQueryAccountInformation, setSearchQueryAccountInformation] = useState('');
    const [sortingAccountInformation, setSortingAccountInformation] = useState([{ id: 'role_name', asc: true }]);
    const [paginationAccountInformation, setPaginationAccountInformation] = useState({
        pageIndex: 0,
        pageSize: 5,
    })

    const { showAlertDialog } = useDialog();

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState([])
    const [isRoleChange, setIsRoleChange] = useState(false);
    const [activeRole, setActiveRole] = useState(() => getLocalStorage("selected-role", {}));

    const [roles, setRoles] = useState([]);
    const [printData, setPrintData] = useState(null);

    const [stateLoading, setStateLoading] = useState("idle");

    const [modalAccountInformation, setModalAccountInformation] = useState(false)

    const [listAvailableAccess, setListAvailableAccess] = useState({
        entity: [
            { id: "1", name: 'PUNINAR JAYA - JKT' },
            { id: "2", name: 'PUNINAR JAYA - PSR' },
            { id: "3", name: 'PUNINAR SARANA RAYA - PLB' },
        ],
        customer: [
            { id: '1', name: 'PT. BRIDGESTONE TIRE INDONESIA' },
            { id: '2', name: 'PT. SORINI AGRO ASIA CORPORINDO' },
            { id: '3', name: 'CV. TIRE INDONESIA' },
            { id: '4', name: 'UD. ONDA INDONESIA' },
            { id: '5', name: 'PT. GARDEN TIRE INDONESIA' },
            { id: '6', name: 'PT. RAI TIRE INDONESIA' },
        ],
        pool: [
            { id: '1', name: 'POOL 1' },
            { id: '2', name: 'POOL 2' },
            { id: '3', name: 'POOL 3' },
            { id: '4', name: 'POOL 4' },
            { id: '5', name: 'POOL 5' },
            { id: '6', name: 'POOL 6' },
            { id: '8', name: 'POOL 8' },
            { id: '9', name: 'POOL 9' },
            { id: '10', name: 'POOL 10' },
            { id: '11', name: 'POOL 11' },
            { id: '12', name: 'POOL 12' },
            { id: '13', name: 'POOL 13' },
        ],
        supplier: [
            { id: '1', name: 'SUPPLIER 1' },
            { id: '2', name: 'SUPPLIER 2' },
            { id: '3', name: 'SUPPLIER 3' },
            { id: '4', name: 'SUPPLIER 4' },
            { id: '5', name: 'SUPPLIER 5' },
            { id: '6', name: 'SUPPLIER 6' },
        ],
    });

    const [filteredAccess, setFilteredAccess] = useState(listAvailableAccess);

    const [selectedAccess, setSelectedAccess] = useState(getLocalStorage("selected-access"), {
        entity: [],
        customer: [],
        pool: [],
        supplier: [],
    });

    const cleanName = (name) => name?.replace(/\s+/g, "");

    const handleBackToLobby = () => {
        setLoading(true);
        setStateLoading("idle");
        setInterval(() => {
            lobby(); //function dari authContext
        }, 2000)
    }

    const handleRoutes = (routes) => {
        setRoutes(routes)
    }

    const handleRoleAtFirstTime = (role) => {
        const r = {
            apps_name: 'ODONG',
            role_name: role.role_name,
            role: role.role_name,
            effective_from: role.effective_from,
            effective_to: role.effective_to,
        }
        setActiveRole(r)
        setLocalStorage("selected-role", r);
    }

    const handleChangeRole = (role) => {
        const r = {
            apps_name: 'ODONG',
            role_name: role.role_name,
            role: role.role_name,
            effective_from: role.effective_from,
            effective_to: role.effective_to,
        }
        showAlertDialog(
            "primary",
            "Confirmation",
            `Are you sure to change role into ${role.role_name}?`,
            {
                cancelText: "Cancel",
                actionText: "Yes, Continue",
                onConfirm: () => {
                    setIsRoleChange(true);
                    setActiveRole(r)
                    setLocalStorage("selected-role", r);
                },
            }
        )
    };

    // helper untuk bikin route object
    const mapMenuToRoute = (item) => {
        const CleanName = cleanName(item.component);
        const Component = componentRoute[CleanName];

        // appProps yang akan diinject ke semua halaman
        const appProps = {
            handlePrintData,
            printData,
            activeRole,
            auth,
            modules,
            item,
            userRole,
        }

        const Wrapped = Component ? withAppContext(Component, appProps) : NotAssigned

        return {
            title: item.menu_name,
            access: item.access,
            icon: Icon[item.menu_icon] || Icon.HelpCircle,   // fallback
            visibility: item.visibility === "false" ? false : true,
            path: item.menu_url,
            element: <Wrapped />,
            ...(item.children && {
                items: item.children.map(mapMenuToRoute), // recursive
            }),
        };
    };

    const mapMenuAccess = (item) => {
        const key = item.menu_name.replace(/\s+/g, "");

        const node = {
            [key]: {
                access: item.access,
                path: item.menu_url,
            }
        };

        if (Array.isArray(item.children) && item.children.length > 0) {
            item.children.forEach((child) => {
                Object.assign(node[key], mapMenuAccess(child));
            });
        }

        return node;
    };

    const getRoutes = async () => {
        if (!activeRole.role) return;
        const res = await apiCall("/api/mst/get-menu-user-role", "POST", {
            role: activeRole.role,
            npk: auth.nik,
            module: "web", //mobile | web
        });
        if (!res.success) return;

        const data = res?.data?.menu?.map(mapMenuToRoute) || [];
        const access = res?.data?.menu?.map(mapMenuAccess) || [];
        setLocalStorage('menu-access', access);
        setRoutes(data);
        return data;
    };

    const handlePrintData = (data) => setPrintData(data)

    // untuk kebutuhan visibility setting

    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        description: "",
        showCancelButton: false,
    })


    const openModal = ({ title, description, showCancelButton }) => {
        setModalState({
            isOpen: true,
            title,
            description,
            showCancelButton,
        })
    }
    const closeModal = () => {
        // form.reset();
        setSelectedAccess(getLocalStorage("selected-access"));
        setModalState((prev) => ({ ...prev, isOpen: false, showCancelButton: false }))
    }

    const handleOpen = () => {
        openModal({
            title: "Manage Visibility Setting",
            // description: "Ini modal description",
            showCancelButton: true,
        })
    }

    const handleChange = (sectionKey, item, checked) => {
        setSelectedAccess((prev) => {
            const prevSection = Array.isArray(prev?.[sectionKey]) ? prev[sectionKey] : [];
            const updatedSection = checked
                ? [...prevSection, item]
                : prevSection.filter((i) => i.id !== item.id);

            return {
                ...prev,
                [sectionKey]: updatedSection,
            };
        });

        setListAvailableAccess((prev) => {
            const prevSection = Array.isArray(prev?.[sectionKey]) ? prev[sectionKey] : [];
            return {
                ...prev,
                [sectionKey]: prevSection.map((i) =>
                    i.id === item.id ? { ...i, checked } : i
                ),
            };
        });
    };


    const handleSelectAll = (sectionKey) => {
        setSelectedAccess((prev) => ({
            ...prev,
            [sectionKey]: listAvailableAccess[sectionKey],
        }));
    };

    const handleDeselectAll = (sectionKey) => {
        setSelectedAccess((prev) => ({
            ...prev,
            [sectionKey]: [],
        }));
    };

    const handleSearch = (sectionKey, searchValue) => {
        const keyword = searchValue.toLowerCase();

        if (!keyword) {
            setFilteredAccess(prev => ({
                ...prev,
                [sectionKey]: listAvailableAccess[sectionKey],
            }));
            return;
        }

        const filtered = listAvailableAccess[sectionKey].filter(item =>
            item.name.toLowerCase().includes(keyword)
        );

        setFilteredAccess(prev => ({
            ...prev,
            [sectionKey]: filtered,
        }));
    };

    const handleSave = useCallback(() => {
        setLocalStorage('selected-access', selectedAccess);
        closeModal();
    }, [selectedAccess]);

    const getUserRole = async () => {
        const res = await apiCall("/api/mst/get-user-role", "POST", {
            npk: auth.nik
        });
        if (!res.success) return;

        const data = res;
        return data;
    };

    const handleAccountInformation = () => {
        setModalAccountInformation(!modalAccountInformation)
        getUserRole().then((data) => {
            console.log(data)
            setDataRecAccountInformation({
                roles: data.data.roles,
                user: data.data.user
            })
        })
    }

    const handlePaginationAccountInformation = (pagination) => {
        setPaginationAccountInformation(pagination)
    }

    const handleSortingAccountInformation = (sorting) => {
        setSortingAccountInformation(sorting)
    }

    const handleSearchAccountInformation = (searchQuery) => {
        setSearchQueryAccountInformation(searchQuery)
    }

    const handleColumnFiltersAccountInformation = (columnFilters) => {
        setColumnFiltersAccountInformation(columnFilters)
    }

    useEffect(() => {
        const roles = role?.split("|").map(rl => ({
            apps_name: "ODONG",
            logo: OdongIcon,
            role_name: rl.trim()
        }));

        setRoles(roles)

        getRoutes().then((data) => {
            if (isRoleChange) navigate("/")
        })

        const handleAfterPrint = () => setPrintData(null)
        window.addEventListener("afterprint", handleAfterPrint)
        return () => window.removeEventListener("afterprint", handleAfterPrint)
    }, [activeRole.role, isRoleChange]);

    return {
        loading,
        setLoading,
        roles,
        routes,
        printData,
        activeRole,
        handleRoutes,
        handleRoleAtFirstTime,
        handleChangeRole,
        stateLoading,
        setStateLoading,
        handleBackToLobby,

        // untuk kebutuhan visibility settings

        modalState,
        setModalState,
        openModal,
        closeModal,
        handleOpen,
        filteredAccess,
        setFilteredAccess,
        selectedAccess,
        setSelectedAccess,
        handleChange,
        handleSelectAll,
        handleDeselectAll,
        handleSearch,
        handleSave,

        modalAccountInformation,
        handleAccountInformation,
        columnsAccountInformation,
        dataRecAccountInformation,
        sortingAccountInformation,
        paginationAccountInformation,
        searchQueryAccountInformation,
        columnFiltersAccountInformation,
        handleSearchAccountInformation,
        handleSortingAccountInformation,
        handlePaginationAccountInformation,
        handleColumnFiltersAccountInformation,
    }
}