"use client"

import { AiOutlineDashboard } from "react-icons/ai"
import { BiCategory } from "react-icons/bi"
import { IoShirtOutline } from "react-icons/io5"
import { MdOutlineShoppingBag } from "react-icons/md"
import { LuUserRound } from "react-icons/lu"
import { IoMdStarOutline } from "react-icons/io"
import { MdOutlinePermMedia } from "react-icons/md"
import { RiCoupon2Line } from "react-icons/ri"
import { MdOutlineShoppingCart } from "react-icons/md"
import { Admin_Dashboard, Admin_Media_Show } from "@/routes/Admin"

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: AiOutlineDashboard,
    href: Admin_Dashboard,
  },
  {
    title: "Category",
    icon: BiCategory,
    href: "/admin/category",
    subItems: [
      { title: "All Categories", href: "/admin/category" },
      { title: "Add Category", href: "/admin/category/add" },
      { title: "Category Settings", href: "/admin/category/settings" },
    ],
  },
  {
    title: "Products",
    icon: MdOutlineShoppingBag,
    href: "/admin/products",
    subItems: [
      { title: "All Products", href: "/admin/products" },
      { title: "Add Product", href: "/admin/products/add" },
      { title: "Product Reviews", href: "/admin/products/reviews", icon: IoMdStarOutline },
      { title: "Product Media", href: "/admin/products/media", icon: MdOutlinePermMedia },
      { title: "Inventory", href: "/admin/products/inventory" },
    ],
  },
  {
    title: "Orders",
    icon: MdOutlineShoppingCart,
    href: "/admin/orders",
    subItems: [
      { title: "All Orders", href: "/admin/orders" },
      { title: "Pending Orders", href: "/admin/orders/pending" },
      { title: "Completed Orders", href: "/admin/orders/completed" },
      { title: "Order Analytics", href: "/admin/orders/analytics" },
    ],
  },
  {
    title: "Customers",
    icon: LuUserRound,
    href: "/admin/customers",
    subItems: [
      { title: "All Customers", href: "/admin/customers" },
      { title: "Customer Analytics", href: "/admin/customers/analytics" },
      { title: "Customer Support", href: "/admin/customers/support" },
    ],
  },
  {
    title: "Rating & Review",
    icon: IoMdStarOutline,
    href: "/admin/reviews",
    subItems: [
      { title: "All Reviews", href: "/admin/reviews" },
      { title: "Pending Reviews", href: "/admin/reviews/pending" },
      { title: "Review Analytics", href: "/admin/reviews/analytics" },
    ],
  },
  {
    title: "Media",
    icon: MdOutlinePermMedia,
    href: "/admin/media",
    subItems: [
      { title: "All Media", href: "/admin/media" },
      { title: "Upload Media", href: "/admin/media/upload" },
      { title: "Media Library", href: "/admin/media/library" },
    ],
  },
  {
    title: "Coupons",
    icon: RiCoupon2Line,
    href: "/admin/coupons",
    subItems: [
      { title: "All Coupons", href: "/admin/coupons" },
      { title: "Add Coupon", href: "/admin/coupons/add" },
      { title: "Coupon Analytics", href: "/admin/coupons/analytics" },
    ],
  },
]



export const AdminSidebarMenu = [
  {
    title: "Dashboard",
    url: Admin_Dashboard,
    icon: AiOutlineDashboard,
  },
  {
    title: "Category",
    url: "#",
    icon: BiCategory,
    submenu: [
      {
        title: "Add Category",
        url: "#",
      },
      {
        title: "All Category",
        url: "#",
      },

    ]
  },
  {
    title: "Products",
    url: "#",
    icon: IoShirtOutline,
    submenu: [
      {
        title: "Add Products",
        url: "#",
      },
      {
        title: "Add Variant",
        url: "#",
      },
      {
        title: "All Products",
        url: "#",
      },
      {
        title: "Products Variants",
        url: "#",
      },

    ]
  },
  {
    title: "Coupons",
    url: "#",
    icon: RiCoupon2Line,
    submenu: [
      {
        title: "Add Coupons",
        url: "#",
      },
      {
        title: "All Coupons",
        url: "#",
      },
    ]
  },
  {
    title: "Orders",
    url: "#",
    icon: MdOutlineShoppingBag,
  },
  {
    title: "Coustomers",
    url: "#",
    icon: LuUserRound,
  },
  {
    title: "Rating & Review",
    url: "#",
    icon: IoMdStarOutline,
  },
  {
    title: "Media",
    url: Admin_Media_Show,
    icon: MdOutlinePermMedia,
  },

]