export default function(role) {
  let nav = [
    // {
    //   title: "Overview",
    //   to: "/dashboard/overview",
    //   htmlBefore: '<i class="material-icons">rounded_corner</i>',
    //   htmlAfter: ""
    // },
    {
      title: "Map View",
      htmlBefore: '<i class="material-icons">my_location</i>',
      role: ["super", "admin", "fdc_admin", "meds_admin","o2_admin"],
      to: "/dashboard/map"
    },
    {
      title: "Asset List",
      htmlBefore: '<i class="material-icons">local_shipping</i>',
      role: ["super", "admin", "fdc_admin", "meds_admin","o2_admin"],
      to: "/dashboard/assets"
    },
    {
      title: "Request List",
      htmlBefore: '<i class="material-icons">emoji_people</i>',
      role: ["super", "admin", "meds_admin","o2_admin"],
      to: "/dashboard/requests"
    },
    // {
    //   title: "Services",
    //   htmlBefore: '<i class="material-icons">my_location</i>',
    //   to: "/dashboard/services"
    // },
    {
      title: "Create Request",
      htmlBefore: '<i class="material-icons">note_add</i>',
      role: ["super", "admin", "meds_admin","o2_admin"],
      to: "/dashboard/create-request"
    },
    {
      title: "FDC Overview",
      htmlBefore: '<i class="material-icons">local_dining</i>',
      role: ["super", "fdc_admin", "fdc_local_read"],
      to: "/dashboard/fdc/overview"
    },
    {
      title: "Register FDC",
      htmlBefore: '<i class="material-icons">domain</i>',
      role: ["super", "fdc_admin"],
      to: "/dashboard/fdc/register"
    },

    {
      title: "Food Dirstibution Centres",
      htmlBefore: '<i class="material-icons">local_dining</i>',
      role: ["super", "fdc_admin"],
      to: "/dashboard/fdc/list"
    },
    {
      title: "Register Food Request",
      htmlBefore: '<i class="material-icons">restaurant</i>',
      role: ["super", "fdc_admin", "fdc_volunteer"],
      to: "/dashboard/food/request/register"
    },
    {
      title: "Food Requests",
      htmlBefore: '<i class="material-icons">fastfood</i>',
      role: ["super", "fdc_admin"],
      to: "/dashboard/food/request/list"
    },
    {
      title: "Logout",
      htmlBefore: '<i class="material-icons">backspace</i>',
      role: ["super", "admin", "fdc_admin", "meds_admin","o2_admin"],
      to: "/logout"
    }
    // {
    //   title: "Forms & Components",
    //   htmlBefore: '<i class="material-icons">view_module</i>',
    //   to: "/components-overview"
    // },
    // {
    //   title: "Tables",
    //   htmlBefore: '<i class="material-icons">table_chart</i>',
    //   to: "/tables"
    // },
    // {
    //   title: "User Profile",
    //   htmlBefore: '<i class="material-icons">person</i>',
    //   to: "/user-profile-lite"
    // },
    // {
    //   title: "Errors",
    //   htmlBefore: '<i class="material-icons">error</i>',
    //   to: "/errors"
    // }
  ];
  let nav_items = [];
  for (let nv of nav) {
    if (nv.role.indexOf(role) !== -1) {
      nav_items.push(nv);
    }
  }
  return nav_items;
}
