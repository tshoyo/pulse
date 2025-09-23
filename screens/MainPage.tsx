import {
  Avatar,
  Button,
  DottedLine,
  Image,
  ThemedText as Text,
  ThemedView as View,
} from "@/components";
import { DroneMarker } from "@/components/drone-marker";
import MapView from "@/components/map-view";
import { Marker } from "@/components/map-view/map-view";
import { TaskCategoryList } from "@/components/task-category-list";
import { MapDisplay } from "@/constants/map";
import { Colors, Font, Spacing } from "@/constants/theme";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  checkMultiple,
  Permission,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";

const REQUIRED_PERMISSIONS = Platform.select({
  ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
  android: [
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ],
  web: [],
}) as Permission[];

type DroneInfo = {
  id: string;
  latitude: number;
  longitude: number;
  name?: string;
  connected?: boolean;
};

type FullDroneInfo = DroneInfo & {
  battery: number;
  distance: string;
  time: {
    value: number;
    unit: string;
  };
  description: string;
  image: ImageSourcePropType;
  agency: {
    name: string;
    insignia: ImageSourcePropType;
    hasBadge: boolean;
  };
  connecting: boolean;
};

const DroneInfoCard = ({
  drone,
  onConnectPress,
}: {
  drone: FullDroneInfo;
  onConnectPress: () => void;
}) => {
  return (
    <View style={styles.droneInfoCard}>
      <View style={styles.droneInfoCardHeader}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={[Colors.brand.primary.highlight, Colors.brand.primary.tint]}
          locations={[0.25, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "transparent",
          }}
        >
          <Image source={require("@/assets/icons/pulse.png")} />
          <Text style={{ fontSize: Font.size.medium, color: Colors.dark.text }}>
            {drone.battery}% Battery
          </Text>
        </View>
        <Text
          style={{
            fontSize: Font.size.large,
            fontWeight: "bold",
            color: Colors.dark.text,
          }}
        >
          {drone.name}
        </Text>
        <View style={styles.droneInfoCardHeaderBottom}></View>
      </View>
      <View style={styles.droneInfoCardContent}>
        {drone.connected ? (
          <>
            <View
              style={{
                alignItems: "center",
                gap: Spacing.block.medium,
              }}
            >
              <Image source={require("@/assets/images/drone-connected.png")} />
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: Spacing.text.small,
                }}
              >
                <Image
                  source={require("@/assets/icons/check-circle-green.png")}
                  style={{ width: 22, height: 22 }}
                />
                <Text style={{ color: Colors.gray.light["100"] }}>
                  Drone Connected
                </Text>
              </View>
            </View>
          </>
        ) : drone?.connecting ? (
          <>
            <ActivityIndicator
              size="large"
              color={Colors.brand.primary.color}
            />
          </>
        ) : (
          <>
            <Text
              style={{
                color: Colors.gray.dark["100"],
                fontSize: Font.size.medium,
              }}
            >
              {drone.time.value} {drone.time.unit} away ({drone.distance})
            </Text>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: Spacing.block.small,
                marginBottom: Spacing.block.medium,
                marginTop: Spacing.block.xxsmall,
              }}
            >
              <Text
                style={{
                  fontSize: Font.size.large,
                  fontWeight: "bold",
                }}
              >
                {drone.description}
              </Text>

              <Avatar
                avatar={drone.agency.insignia}
                {...(drone.agency.hasBadge && {
                  badgeImage: require("@/assets/icons/check-shield.png"),
                })}
              />
            </View>
            <View
              style={{
                paddingHorizontal: Spacing.block.large,
              }}
            >
              <Button
                text="Connect"
                block
                hideArrow
                bold
                onPress={onConnectPress}
              />
            </View>
          </>
        )}
      </View>
      <Image
        source={require("@/assets/images/drone.png")}
        style={[styles.droneInfoCardImage]}
      />
    </View>
  );
};

const FindDroneView = ({
  onFindPress,
  onLocationPress,
}: {
  onFindPress?: () => void;
  onLocationPress?: () => void;
}) => (
  <View
    style={{
      padding: Spacing.block.medium,
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.block.small,
    }}
  >
    <Button
      onPress={onLocationPress}
      icon={require("@/assets/icons/location.png")}
      color="secondary"
    ></Button>
    <Button onPress={onFindPress} text="Find Nearby Drone"></Button>
  </View>
);

enum UserStep {
  CONNECTING,
  TASKS,
}
export default function MainPage() {
  //const mapRef: Ref<MapView> = useRef(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [step, setStep] = useState<UserStep>(UserStep.CONNECTING);
  const [hasLocationPerms, setHasLocationPerms] = useState(false);
  const [droneInfos, setDroneInfos] = useState<DroneInfo[]>([]);
  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
    angle: number;
  }>({ latitude: 42.358617, longitude: -83.074034, angle: -45 });
  const [selectedDrone, setSelectedDrone] = useState<FullDroneInfo | null>(
    null
  );

  const onLocationPress = () => {
    if (!hasLocationPerms) {
      checkMultiple(REQUIRED_PERMISSIONS).then((statuses) => {
        setHasLocationPerms(
          Object.values(statuses).every((status) => status === RESULTS.GRANTED)
        );
      });
    } else {
      //   if (mapRef) {
      //     mapRef.current?.animateCamera(
      //       {
      //         center: {
      //           latitude: userLocation.latitude,
      //           longitude: userLocation.longitude,
      //         },
      //       },
      //       { duration: 0.5 }
      //     );
      //   }
    }
  };
  const onFindPress = () => {
    setDroneInfos([
      {
        id: "19191",
        latitude: 42.364919,
        longitude: -83.073354,
        name: "Drone Model 5",
        connected: false,
      },
    ]);
  };
  const onConnectPress = () => {
    if (selectedDrone) setSelectedDrone({ ...selectedDrone, connecting: true });
    setTimeout(() => {
      if (selectedDrone)
        setSelectedDrone({
          ...selectedDrone,
          connecting: false,
          connected: true,
        });
      setTimeout(() => {
        setStep(UserStep.TASKS);
      }, 1000);
    }, 2500);
  };

  useEffect(() => {
    // if (mapRef && droneInfos.length) {
    //   let droneInfo = droneInfos[0];
    //   mapRef.current?.animateCamera(
    //     {
    //       center: {
    //         latitude: droneInfo.latitude,
    //         longitude: droneInfo.longitude,
    //       },
    //     },
    //     { duration: 0.5 }
    //   );
    // }
  }, [droneInfos]);
  useEffect(() => {
    checkMultiple(REQUIRED_PERMISSIONS).then((statuses) => {
      setHasLocationPerms(
        Object.values(statuses).every((status) => status === RESULTS.GRANTED)
      );
    });
  }, []);
  return (
    <View style={StyleSheet.absoluteFill}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { bottom: -50, right: -100, left: -100, top: -50 },
        ]}
      >
        <MapView
          //ref={mapRef}
          style={styles.map}
          customMapStyle={MapDisplay.style}
          initialRegion={{
            latitude: 42.364919,
            longitude: -83.073354,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          minZoomLevel={MapDisplay.zoom.minimum}
          maxZoomLevel={MapDisplay.zoom.maximum}
          //   cameraZoomRange={{
          //     minCenterCoordinateDistance: MapDisplay.zoom.minimum,
          //     maxCenterCoordinateDistance: MapDisplay.zoom.maximum,
          //   }}
          {...MapDisplay.display}
          {...MapDisplay.controls}
          showsUserLocation={false}
        >
          {true && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
            >
              <Image
                style={{
                  transform: [{ rotateZ: `${userLocation.angle + 45}deg` }],
                }}
                source={require("@/assets/icons/user-location.png")}
              />
            </Marker>
          )}
          {droneInfos.length &&
            droneInfos.map((droneInfo) => (
              <Marker
                key={droneInfo.id}
                coordinate={{
                  latitude: droneInfo.latitude,
                  longitude: droneInfo.longitude,
                }}
                centerOffset={{ x: 0, y: -12 }}
                anchor={{ x: 0.5, y: 1 }}
              >
                <DroneMarker
                  name={droneInfo.name}
                  connected={droneInfo.connected}
                  onPress={() => {
                    setSelectedDrone({
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
                    });
                  }}
                />
              </Marker>
            ))}
        </MapView>
      </View>
      <View style={styles.header}>
        <LinearGradient
          style={styles.headerGradient}
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          locations={[0.4, 1]}
        ></LinearGradient>
        <Image source={require("@/assets/images/logo.png")} />
        <TouchableOpacity onPress={() => router.navigate("/completed")}>
          <Image source={require("@/assets/icons/menu.png")} />
        </TouchableOpacity>
      </View>
      {step === UserStep.TASKS ? (
        <BottomSheet
          enableDynamicSizing={false}
          snapPoints={[300, "66%"]}
          ref={bottomSheetRef}
          handleIndicatorStyle={styles.bottomSheetHandleIndicator}
          handleStyle={styles.bottomSheetHandle}
        >
          <BottomSheetScrollView
            style={styles.bottomSheetContainer}
            //contentContainerStyle={styles.bottomSheetContentContainer}
          >
            <Text
              style={{
                color: Colors.dark.background,
                fontSize: Font.size.xlarge,
                fontWeight: "500",
              }}
            >
              Choose your task.
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: Spacing.text.small,
                marginVertical: Spacing.text.small,
                alignItems: "center",
              }}
            >
              <Image source={require("@/assets/icons/categories.png")} />
              <Text
                style={{
                  color: Colors.gray.dark["500"],
                  fontSize: Font.size.medium,
                }}
              >
                Task Categories
              </Text>
            </View>
            <DottedLine />
            <View
              style={{
                width: "100%",
                gap: Spacing.block.small,
                paddingVertical: Spacing.block.small,
              }}
            >
              <TaskCategoryList supportedTypes={[]} />
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      ) : (
        <View style={styles.footer}>
          {selectedDrone ? (
            <DroneInfoCard
              drone={selectedDrone}
              onConnectPress={onConnectPress}
            />
          ) : (
            <FindDroneView
              onFindPress={onFindPress}
              onLocationPress={onLocationPress}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
    padding: Spacing.block.medium,
    paddingBottom: Spacing.block.medium * 4,
    flexDirection: "row",
    justifyContent: "space-between",
    pointerEvents: "box-none",
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  footer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  droneInfoCard: {
    borderRadius: Spacing.block.small,
    overflow: "hidden",
    position: "relative",
    margin: Spacing.block.medium,
    marginTop: 0,
    shadowColor: "#B2B2B2",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
  },
  droneInfoCardHeader: {
    overflow: "visible",
    padding: Spacing.block.small,
    paddingBottom: Spacing.block.large,
  },
  droneInfoCardHeaderBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Spacing.block.small,
    borderTopRightRadius: Spacing.block.small,
    height: Spacing.block.small,
  },
  droneInfoCardContent: {
    padding: Spacing.block.small,
    paddingTop: 0,
    minHeight: 180,
    justifyContent: "space-around",
  },
  droneInfoCardImage: {
    position: "absolute",
    transformOrigin: "top",
    transform: [
      { scale: 0.26367 },
      { rotateZ: "15deg" },
      { translateY: "-5%" },
      { translateX: "-5%" },
    ],

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: Spacing.block.small,
    // alignItems: "center",
  },
  bottomSheetContentContainer: {
    // alignItems: "center",
  },
  bottomSheetHandle: {},
  bottomSheetHandleIndicator: {
    width: 70,
    backgroundColor: Colors.gray.light["800"],
  },
});
