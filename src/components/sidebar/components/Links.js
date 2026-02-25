/* eslint-disable */
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Text,
  Collapse,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";

export function SidebarLinks({ routes }) {
  const location = useLocation();

  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const activeIcon = useColorModeValue("#045e14", "white");
  const textColor = useColorModeValue("secondaryGray.500", "white");
  const brandColor = useColorModeValue("#045e14", "#045e14");

  const activeRoute = (routeName) => location.pathname.includes(routeName);

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Recursive function to create sidebar links
  const createLinks = (routes) =>


    routes.map((route, index) => {
      if (route.showInSidebar === false) {
      return null;
      }
      // Dropdown parent (with collapse and items)
      if (route.collapse && route.items) {
        return (
          <Box key={index}>
            <Flex
              align="center"
              justify="space-between"
              px="10px"
              py="8px"
              cursor="pointer"
              onClick={() => handleToggle(route.name)}
              _hover={{ bg: "gray.50" }}
            >
              <HStack>
                {route.icon && (
                  <Box color={textColor} me="10px">
                    {route.icon}
                  </Box>
                )}
                <Text color={activeColor} fontWeight="bold">
                  {route.name}
                </Text>
              </HStack>
              <Icon
                as={openDropdown === route.name ? ChevronDownIcon : ChevronRightIcon}
                color={textColor}
              />
            </Flex>

            <Collapse in={openDropdown === route.name} animateOpacity>
              <Box pl="6">
                {createLinks(route.items)} {/* render nested links */}
              </Box>
            </Collapse>
          </Box>
        );
      }

      // Normal route link (skip invalid)
      const to =
        route.layout && route.path ? `${route.layout}${route.path}` : null;
      if (!to || to === "//") return null;

      return (
        <NavLink key={index} to={to}>
          <HStack
            spacing={activeRoute(route.path) ? "22px" : "26px"}
            py="6px"
            ps="10px"
          >
            <Flex w="100%" alignItems="center" justifyContent="center">
              {route.icon && (
                <Box
                  color={activeRoute(route.path) ? activeIcon : textColor}
                  me="18px"
                >
                  {route.icon}
                </Box>
              )}
              <Text
                me="auto"
                color={activeRoute(route.path) ? activeColor : textColor}
                fontWeight={activeRoute(route.path) ? "bold" : "normal"}
              >
                {route.name}
              </Text>
            </Flex>
            <Box
              h="36px"
              w="4px"
              bg={activeRoute(route.path) ? brandColor : "transparent"}
              borderRadius="5px"
            />
          </HStack>
        </NavLink>
      );
    });

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
