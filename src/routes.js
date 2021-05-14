import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, EmptyLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import AssetList from "./views/AssetList";
import Login from "./views/Login";
import CreateNewRequest from "./views/CreateNewRequest";
import RequestList from "./views/RequestList";
import RequestDetails from "./views/RequestDetails";
import MapView from "./views/MapView";
import RegisterFDC from "./views/RegisterFDC";
import RegisterFoodRequest from "./views/RegisterFoodRequest";
import ListFDCs from "./views/ListFDCs";
import MealRequests from "./views/MealRequests";
import MealRequestDetails from "./views/MealRequestDetails";
import FDCDetails from "./views/FDCDetails";
import VolunteerSignup from "./views/VolunteerSignup";
import FDCOverview from "./views/FDCOverview";
import Logout from "./views/Logout";
export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/dashboard/map" />
  },
  {
    path: "/login",
    exact: true,
    layout: EmptyLayout,
    component: Login
  },
  {
    path: "/volunteer/signup",
    exact: true,
    layout: EmptyLayout,
    component: VolunteerSignup
  },
  {
    path: "/volunteer/food/request/register",
    exact: true,
    layout: DefaultLayout,
    component: RegisterFoodRequest
  },
  // {
  //   path: "/dashboard/overview",
  //   layout: DefaultLayout,
  //   component: BlogOverview
  // },
  // {
  //   path: "/user-profile-lite",
  //   layout: DefaultLayout,
  //   component: UserProfileLite
  // },
  // {
  //   path: "/dashboard/services",
  //   layout: DefaultLayout,
  //   component: AddNewPost
  // },
  {
    path: "/dashboard/create-request",
    layout: DefaultLayout,
    component: CreateNewRequest
  },
  // {
  //   path: "/errors",
  //   layout: DefaultLayout,
  //   component: Errors
  // },
  // {
  //   path: "/components-overview",
  //   layout: DefaultLayout,
  //   component: ComponentsOverview
  // },
  // {
  //   path: "/tables",
  //   layout: DefaultLayout,
  //   component: Tables
  // },
  {
    path: "/dashboard/assets",
    layout: DefaultLayout,
    component: AssetList
  },
  {
    path: "/dashboard/requests",
    layout: DefaultLayout,
    component: RequestList,
    exact: true
  },
  {
    path: "/dashboard/map",
    layout: DefaultLayout,
    component: MapView,
    exact: true
  },
  {
    path: "/dashboard/requests/:id",
    layout: DefaultLayout,
    component: RequestDetails
  },
  {
    path: "/dashboard/fdc/register",
    layout: DefaultLayout,
    component: RegisterFDC,
    exact: true
  },

  {
    path: "/dashboard/food/request/register",
    layout: DefaultLayout,
    component: RegisterFoodRequest,
    exact: true
  },
  {
    path: "/dashboard/fdc/list",
    layout: DefaultLayout,
    component: ListFDCs,
    exact: true
  },
  {
    path: "/dashboard/fdc/overview",
    layout: DefaultLayout,
    component: FDCOverview,
    exact: true
  },
  {
    path: "/dashboard/fdc/details/:id",
    layout: DefaultLayout,
    component: FDCDetails,
    exact: true
  },
  {
    path: "/dashboard/food/request/list",
    layout: DefaultLayout,
    component: MealRequests,
    exact: true
  },
  {
    path: "/dashboard/food/request/details/:id",
    layout: DefaultLayout,
    component: MealRequestDetails
  },
  {
    path: "/volunteer/food/request/details/:id",
    layout: DefaultLayout,
    component: MealRequestDetails
  },
  {
    path: "/logout",
    layout: DefaultLayout,
    component: Logout
  }
];
