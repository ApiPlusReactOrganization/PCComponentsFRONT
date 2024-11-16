import React, { useCallback } from "react";
import ManufacturerTableRow from "./ManufacturerTableRow";
import { isEqual } from "lodash";
import { useRenderCount } from "../../hooks/useRenderCount";

const ManufacturersTable = ({ manufacturerList, onEdit, onDelete }) => {
  const memoizedOnEdit = useCallback(
    (manufacturer) => onEdit(manufacturer),
    [onEdit]
  );

  const memoizedOnDelete = useCallback((id) => onDelete(id), [onDelete]);

  const renderCount = useRenderCount();

  return (
    <>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manufacturerList.map((manufacturer) => (
            <ManufacturerTableRow
              key={manufacturer.id}
              manufacturer={manufacturer}
              onEdit={memoizedOnEdit}
              onDelete={memoizedOnDelete}
            />
          ))}
        </tbody>
      </table>
      <h5>TodoTable render count: {renderCount}</h5>
    </>
  );
};

export default React.memo(ManufacturersTable, (prevProps, nextProps) => {
  return isEqual(prevProps.manufacturerList, nextProps.manufacturerList);
});
