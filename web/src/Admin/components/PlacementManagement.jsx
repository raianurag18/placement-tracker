import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import PlacementTable from './PlacementTable';

const PlacementManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Placement Records</CardTitle>
      </CardHeader>
      <CardContent>
        <PlacementTable />
      </CardContent>
    </Card>
  );
};

export default PlacementManagement;
