import { IconProps, List, ListItem, Text } from "@chakra-ui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineShoppingBag,
  MdMailOutline,
  MdOutlineFlag,
  MdCalendarToday,
  MdOutlineSupervisorAccount,
  MdOutlineSettingsInputComposite,
  MdOutlineChatBubbleOutline,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { NavItem } from "./NavItem";

const items = [
  {
    type: "link",
    label: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    path: "/",
  },
  {
    type: "link",
    label: "Products",
    icon: MdOutlineShoppingBag,
    path: "/",
  },
  {
    type: "link",
    label: "Mail",
    icon: MdMailOutline,
    path: "/",
  },
  {
    type: "link",
    label: "Campaings",
    icon: MdOutlineFlag,
    path: "/",
  },
  {
    type: "link",
    label: "Calendar",
    icon: MdCalendarToday,
    path: "/",
  },
  {
    type: "link",
    label: "Contacts",
    icon: MdOutlineSupervisorAccount,
    path: "/",
  },

  {
    type: "link",
    label: "Notifications",
    icon: MdOutlineNotificationsActive,
    path: "/",
  },
  {
    type: "link",
    label: "Chat",
    icon: MdOutlineChatBubbleOutline,
    path: "/",
    messages: 8,
  },
  {
    type: "link",
    label: "Settings",
    icon: MdOutlineSettingsInputComposite,
    path: "/",
  },
];

interface ICollapseProps{
  collapse : boolean
} 

export const Navigation = ({collapse}:ICollapseProps) => (
  <List w="full" my={8}>
    {items.map((item, index) => (
      <ListItem key={index}>
        <NavItem item={item} isActive={index === 0} collapse={collapse} />
      </ListItem>
    ))}
  </List>
);
