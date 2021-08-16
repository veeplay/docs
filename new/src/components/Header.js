import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar
      bg="transparent"
      expand="lg"
      className="pl-md-5 pr-md-5 w-100"
      style={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <div className="d-flex justify-content-center">
        <Navbar.Brand href="/">
          <img
            src="/assets/icons/VeeplayLogo.svg"
            width="120"
            height="28"
            className="d-inline-block align-top"
            alt="Veeplay logo"
          />
        </Navbar.Brand>
        <img
          src="/assets/Divider.svg"
          alt="|"
          style={{ marginTop: '-0.1em' }}
        />
        <span
          style={{
            fontWeight: '600',
            fontSize: '17px',
            lineHeight: '24px',
            color: '#002641',
          }}
          className="nav-link"
        >
          DOCS
        </span>
      </div>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" style={{ marginTop: '5px' }}>
          <NavLink
            exact
            style={{ marginBottom: '0.3em' }}
            className="nav-link ml-md-3 ml-lg-5 p-2 nav-item"
            to="/video-guides"
            activeClassName="selected-nav"
          >
            Video Guides
          </NavLink>
          <NavLink
            exact
            style={{ marginBottom: '0.3em' }}
            className="nav-link ml-md-3 ml-lg-5 p-2 nav-item"
            to="/faq"
            activeClassName="selected-nav"
          >
            FAQ
          </NavLink>
          <NavLink
            exact
            style={{ marginBottom: '0.3em' }}
            className="nav-link ml-md-3 ml-lg-5 p-2 nav-item"
            to="/video-api"
            activeClassName="selected-nav"
          >
            Video API
          </NavLink>
          <NavLink
            exact
            style={{ marginBottom: '0.3em' }}
            className="nav-link ml-md-3 ml-lg-5 p-2 nav-item"
            to="/ssai"
            activeClassName="selected-nav"
          >
            SSAI
          </NavLink>
          <NavDropdown
            title="Video Player"
            className="nav-link ml-md-3 ml-lg-5 p-2"
            style={{ marginTop: '-0.6em' }}
          >
            <NavDropdown.Item to="/javascript-reference">
              <span className="nav-item">JavaScript Reference</span>
            </NavDropdown.Item>
            <NavDropdown.Item to="/ios-reference">
              <span className="nav-item">iOS Reference</span>
            </NavDropdown.Item>
            <NavDropdown.Item to="/android-reference">
              <span className="nav-item">Android Reference</span>
            </NavDropdown.Item>
            <NavDropdown.Item to="/json-configs-reference">
              <span className="nav-item">JSON Configs Reference</span>
            </NavDropdown.Item>
            <NavDropdown.Item to="/events-reference">
              <span className="nav-item">Events Reference</span>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Header;
