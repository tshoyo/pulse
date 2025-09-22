export const TaskCategories = [
  {
    title: "Police Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/police.png"),
    slug: "police",
  },
  {
    title: "State/City Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/michigan-flag.png"),
    slug: "local-government",
  },
  {
    title: "EMS Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/ambulance.png"),
    slug: "ems",
  },
  {
    title: "Fire Tasks",
    subtitle: "Lorem ipsum dolor sit amet consectetur.",
    image: require("@/assets/images/firetruck.png"),
    slug: "fire",
  },
] as const;

export const Drones = [
  {
    id: "19191",
    latitude: 42.364919,
    longitude: -83.073354,
    name: "Drone Model 5",
    connected: false,
    battery: 98,
    distance: ".5km",
    time: {
      value: 2,
      unit: "mins",
    },
    description: "Designated for police task use.",
    image: require("@/assets/images/drone.png"),
    agency: {
      name: "Detroit Police Department",
      insignia: require("@/assets/images/police-insignia.png"),
      hasBadge: true,
    },
    connecting: false,
  },
];

export const Task = {
  id: "1234",
  steps: [
    {
      title: "Approach the vehicle.",
      subtitle: "Tag",
      icon: require("@/assets/icons/side-mirror.png"),
      description:
        "Approach the vehicle directly in front of the officers vehicle.",
    },
    {
      title: "Scan outer vehicle.",
      subtitle: "Tag",
      icon: require("@/assets/icons/car.png"),
      description:
        "Check the vehicle for its make, model, and license plate number.",
    },
    {
      title: "Speeding speech prompt.",
      subtitle: "Tag",
      icon: require("@/assets/icons/comment.png"),
      description:
        "Hello, you are being pulled over for speeding. You were recorded going [insert speed] in a [insert speed].",
    },
    {
      title: "Scan inner vehicle.",
      subtitle: "Tag",
      icon: require("@/assets/icons/seat-belt.png"),
      description:
        "Verify the vehicle number of the individuals, ensure that seatbelts are fastened, and check for any potential weapons.",
    },
    {
      title: "Scan owner license.",
      subtitle: "Tag",
      icon: require("@/assets/icons/drivers-license.png"),
      description:
        "Ask the driver to hold the back of their license up to be scanned.",
    },
    {
      title: "Scan owner registration.",
      subtitle: "Tag",
      icon: require("@/assets/icons/document.png"),
      description:
        "Ask the driver to hold up their registration to be scanned.",
    },
  ],
  title: "Traffic Stop",
  subtitle: "Speeding",
  icon: require("@/assets/icons/speedometer.png"),
};
