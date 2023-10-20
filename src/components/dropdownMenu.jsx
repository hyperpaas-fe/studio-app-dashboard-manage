import React, { isValidElement, useMemo } from "react";
import { DownOne, UpOne } from "@icon-park/react";

function DropdownMenu(props) {
  const {
    openKey,
    expendItem,
    selectedKey,
    title,
    icon,
    items,
    onOpen,
    onSelect,
  } = props || {};

  const menuIcon = isValidElement(icon) ? icon : null;

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

  const open = useMemo(() => {
    const { key, open } = expendItem || {};
    if (openKey === key && open) {
      return true;
    }
    return false;
  }, [openKey, expendItem]);

  const handleToggleIcon = () => {
    onOpen({ key: openKey, open: !open });
  };

  return (
    <div className="dropdown-menu-con">
      <div
        className="menu-item-parent basic-style"
        style={{ color: isSelected ? "#8660fd" : "" }}
      >
        <span
          className="pin-left"
          onClick={() => {
            selectedItem(items[0]);
            onOpen({ key: openKey, open: true });
          }}
        >
          {menuIcon}
          <span style={{ marginLeft: 12 }}>{title}</span>
        </span>

        <span className="pin-right" onClick={handleToggleIcon}>
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
