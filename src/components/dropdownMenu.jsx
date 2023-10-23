import React, { isValidElement, useMemo, useState } from "react";
import { DownOne, UpOne } from "@icon-park/react";

function DropdownMenu(props) {
  const { selectedKey, title, icon, items, onSelect } = props || {};

  const menuIcon = isValidElement(icon) ? icon : null;

  const [open, setOpen] = useState(true);

  const isSelected = useMemo(() => {
    if (!selectedKey || !Array.isArray(items)) return false;

    const targetIdx = items.findIndex((item) => item.id === selectedKey);
    return targetIdx > -1;
  }, [selectedKey, items]);

  const selectedItem = (item) => {
    if (typeof onSelect === "function" && item) {
      onSelect(item.id);
    }
  };

  const handleToggleIcon = () => {
    setOpen(!open);
  };

  if (!Array.isArray(items) || !items?.length) {
    return null;
  }

  return (
    <div className="dropdown-menu-con">
      <div
        className="menu-item-parent basic-style"
        style={isSelected ? { color: "#8660fd" } : {}}
        onClick={handleToggleIcon}
      >
        <span className="pin-left">
          {menuIcon}
          <span style={{ marginLeft: 12 }}>{title}</span>
        </span>

        <span className="pin-right">
          {open ? (
            <UpOne size="14" theme="filled" fill="#b3bbc5" />
          ) : (
            <DownOne size="14" theme="filled" fill="#b3bbc5" />
          )}
        </span>
      </div>

      {open && (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className={`menu-item-child basic-style`}
              onClick={() => selectedItem(item)}
            >
              <div
                className={`${
                  selectedKey === item.id && "selected-style"
                } menu-item-child-content`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default DropdownMenu;
