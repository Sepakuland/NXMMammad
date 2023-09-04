import React from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { TaskBoardColumn } from '@progress/kendo-react-taskboard';

const themeColor = {
  todo: 'warning',
  inProgress: 'info',
  done: 'success',
};
const ColumnHeader = (props) => {
  const { edit, title, status } = props.column;
  return (
    <div className={'k-taskboard-column-header'}>
      <div className={'k-taskboard-column-header-text k-text-ellipsis'}>
        {edit ? (
          <Input
            value={title}
            onChange={props.onTitleChange}
            onBlur={props.onColumnExitEdit}
            autoFocus={true}
          />
        ) : (
          <>
            <BadgeContainer
              style={{
                left: '12px',
                top: '-4px',
              }}
            >
              <Badge
                themeColor={themeColor[status]}
                style={{
                  zIndex: 0,
                }}
              >
                {props.tasks && props.tasks.length}
              </Badge>
            </BadgeContainer>
            <span
              style={{
                marginLeft: '30px',
              }}
            >
              {title}
            </span>
          </>
        )}
      </div>
      <span className={'k-spacer'} />
    </div>
  );
};
export const Column = (props) => {
  return <TaskBoardColumn {...props} header={ColumnHeader} draggable={false} />;
};
