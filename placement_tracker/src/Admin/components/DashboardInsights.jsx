import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import PlacementInsights from './PlacementInsights';

const DashboardInsights = () => {
  return (
    <Card>
      <CardContent>
        <PlacementInsights />
      </CardContent>
    </Card>
  );
};

export default DashboardInsights;
