import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/all';

const SideNav = () => {
  const [showSubItems, setShowSubItems] = useState(false);
  const handleShowSubItems = () => setShowSubItems(!showSubItems);
  const [showSubItems2, setShowSubItems2] = useState(false);
  const handleShowSubItems2 = () => setShowSubItems2(!showSubItems2);
  return (
    <div className="sidenav">
      <div className="sidenav-item-div">
        <p className="sidenav-item">Primary list item</p>
      </div>
      <div className="sidenav-item-div">
        <p className="sidenav-item">Primary list item</p>
      </div>
      <div className="sidenav-item-div" onClick={handleShowSubItems}>
        <p className="sidenav-item">
          Primary list item
          {showSubItems ? (
            <HiChevronUp size={20} style={{ marginLeft: '110px' }} />
          ) : (
            <HiChevronDown size={20} style={{ marginLeft: '110px' }} />
          )}
        </p>
      </div>
      {showSubItems ? (
        <div className="sidenav-item-sub-div">
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div" style={{ display: 'flex' }}>
            <span className="span-sidenav">GET</span>
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
        </div>
      ) : null}
      <div className="sidenav-item-div" onClick={handleShowSubItems2}>
        <p className="sidenav-item">
          Primary list item
          {showSubItems2 ? (
            <HiChevronUp size={20} style={{ marginLeft: '110px' }} />
          ) : (
            <HiChevronDown size={20} style={{ marginLeft: '110px' }} />
          )}
        </p>
      </div>
      {showSubItems2 ? (
        <div className="sidenav-item-sub-div">
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div" style={{ display: 'flex' }}>
            <span className="span-sidenav">GET</span>
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
          <div className="sidenav-item-div">
            <p className="sidenav-item sidenav-sub-item">Secondary list item</p>
          </div>
        </div>
      ) : null}
      <div className="sidenav-item-div">
        <p className="sidenav-item">Primary list item</p>
      </div>
    </div>
  );
};

export default SideNav;
