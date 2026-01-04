import { Text } from "@puninar-logistics/pds-sdk";

import { Button } from "@puninar-logistics/pds-sdk";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[80vh] gap-3">
      <Text size="lg" className="font-bold">Dashboard Page!</Text>
      <Text size="md">Nanti dashboardnya disini.</Text>
      <Button>Button</Button>
    </div>
  );
};

export default Dashboard;
