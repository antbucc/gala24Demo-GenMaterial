import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';


interface ActivityListProps {
  activities: string[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <List>
      {activities.map((activity, index) => (
        <ListItem key={index}>
          <ListItemText primary={activity} />
        </ListItem>
      ))}
    </List>
  );
};

export default ActivityList;
