import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@puninar-logistics/pds-sdk"
import { Button } from "@puninar-logistics/pds-sdk"
import ManageMasterData from "@/assets/svg/welcome-page/ManageMasterData";
import GenerateReport from "@/assets/svg/welcome-page/GenerateReport";
import ViewDashboard from "@/assets/svg/welcome-page/ViewDashboard";
import { useTranslation } from "react-i18next";


function DashboardCard({ title, description, icon, onClick }) {
    return (
        <Card className="shadow-sm hover:shadow-lg transition-all duration-200 rounded-xl py-0 px-0 w-full">
            <CardHeader className="flex flex-col items-center m-1.5 p-0">
                <div className="flex justify-center w-full">
                    <div className="bg-gray-100 rounded-lg pt-2 px-2 overflow-hidden w-full aspect-[2/1] flex items-center justify-center">
                        {icon ? icon : null}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-18 text-start text-gray-500 dark:text-gray-400 text-sm px-4">
                <CardTitle className="text-start text-base text-gray-900 dark:text-gray-200 sm:text-lg">{title}</CardTitle>
                {description}
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
                <Button
                    variant="secondary"
                    className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    onClick={onClick}
                >
                    Detail
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function Welcome() {
    const { t } = useTranslation();
    return (
        <div className="z-10 w-full min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-0">
            <div className="w-full max-w-full text-left">
                {/* Title */}
                <h1 className="text-2xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {t('welcome.title')}
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                    {t('welcome.sub_title')}
                </p>

                {/* Section Title */}
                <h2 className="text-md sm:text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('welcome.feature_discovery')}
                </h2>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    <DashboardCard
                        title={t('welcome.view_dashboard.title')}
                        icon={<ViewDashboard />}
                        description={t('welcome.generate_report.desc')}
                    />
                    <DashboardCard
                        title={t('welcome.generate_report.title')}
                        icon={<GenerateReport />}
                        description={t('welcome.generate_report.desc')}
                    />
                    <DashboardCard
                        title={t('welcome.manage_master_data.title')}
                        icon={<ManageMasterData />}
                        description={t('welcome.generate_report.desc')}
                    />
                </div>

                {/* Footer */}
                <footer className="mt-12 text-xs text-gray-400 text-center">
                    © 2025 Puninar Logistics — Odong Apps
                </footer>
            </div>
        </div>
    );
}

