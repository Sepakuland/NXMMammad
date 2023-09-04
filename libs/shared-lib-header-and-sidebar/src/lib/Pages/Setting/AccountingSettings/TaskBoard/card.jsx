import * as React from 'react';
import { TaskBoardCard } from '@progress/kendo-react-taskboard';
import { CardBody } from '@progress/kendo-react-layout';


const CardBodyComponent = props => {

  return (
    <CardBody>
      {props?.task?.title}
    </CardBody>)
};
export const Card = (props) => {
  return (
    <TaskBoardCard
      cardHeader={null}
      showEditButton={false}
      showDeleteButton={false}
      {...props}
      cardBody={CardBodyComponent}
    />);
};