import { Toast } from "@/components";
import { StateIcon } from "@/components/state";
import { Colors, Font, Spacing } from "@/constants/theme";
import {
  Canvas,
  Text as CanvasText,
  Circle,
  Group,
  matchFont,
} from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useTensorflowModel } from "react-native-fast-tflite";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CameraDevice,
  runAtTargetFps,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useImageLabeler } from "react-native-vision-camera-v3-image-labeling";
import { ImageLabelingOptions } from "react-native-vision-camera-v3-image-labeling/lib/typescript/src/types";
import { Worklets } from "react-native-worklets-core";
import { useResizePlugin } from "vision-camera-resize-plugin";

const boxSize = 280;

const pdf417FieldMapping = {
  // Mandatory fields
  DCA: "Jurisdiction-Specific Vehicle Class",
  DCB: "Jurisdiction-Specific Restriction Codes",
  DCD: "Jurisdiction-Specific Endorsement Codes",
  DBA: "Document Expiration Date",
  DCS: "Customer Family Name",
  DAC: "Customer First Name",
  DAD: "Customer Middle Name(s)",
  DBD: "Document Issue Date",
  DBB: "Date of Birth",
  DBC: "Physical Description - Sex",
  DAY: "Physical Description - Eye Color",
  DAU: "Physical Description - Height",
  DAG: "Address - Street 1",
  DAI: "Address - City",
  DAJ: "Address - Jurisdiction Code",
  DAK: "Address - Postal Code",
  DAQ: "Customer ID Number",
  DCF: "Document Discriminator",
  DCG: "Country Identification",
  DDE: "Family Name Truncation",
  DDF: "First Name Truncation",
  DDG: "Middle Name Truncation",

  // Optional fields
  DAH: "Address - Street 2",
  DAZ: "Hair Color",
  DCI: "Place of Birth",
  DCJ: "Audit Information",
  DCK: "Inventory Control Number",
  DBN: "Alias/AKA Family Name",
  DBG: "Alias/AKA Given Name",
  DBS: "Alias/AKA Suffix Name",
  DCU: "Name Suffix",
  DCE: "Physical Description - Weight Range",
  DCL: "Race/Ethnicity",
  DCM: "Standard Vehicle Classification",
  DCN: "Standard Endorsement Code",
  DCO: "Standard Restriction Code",
  DCP: "Jurisdiction-Specific Vehicle Classification Description",
  DCQ: "Jurisdiction-Specific Endorsement Code Description",
  DCR: "Jurisdiction-Specific Restriction Code Description",
  DDA: "Compliance Type",
  DDB: "Card Revision Date",
  DDC: "HazMat Endorsement Expiration Date",
  DDD: "Limited Duration Document Indicator",
  DAW: "Weight (pounds)",
  DAX: "Weight (kilograms)",
  DDH: "Under 18 Until",
  DDI: "Under 19 Until",
  DDJ: "Under 21 Until",
  DDK: "Organ Donor Indicator",
  DDL: "Veteran Indicator",

  // Additional optional fields
  ZVA: "Court Restriction",
  ZVB: "Court Restriction Description",
  ZVC: "Court Restriction Code",
  PAA: "Permit Classification Code",
  PAB: "Permit Expiration Date",
  PAC: "Permit Identifier",
  PAD: "Permit IssueDate",
  PAE: "Permit Restriction Code",
  PAF: "Permit Endorsement Code",
};
// Keypoint names in order
const KEYPOINTS = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
];
// Helper function to draw skeleton connections
const POSE_CONNECTIONS = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],

  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
  // Face connections
  ["nose", "left_eye"],
  ["nose", "right_eye"],
  ["left_eye", "left_ear"],
  ["right_eye", "right_ear"],
];
const parseMultiposeOutput = (output, imageWidth, imageHeight) => {
  const detectedPeople = [];
  const outputArray = output; // Shape: [1, 6, 56]

  // Extract data for up to 6 people
  for (let personIdx = 0; personIdx < 6; personIdx++) {
    const personData = outputArray.slice(personIdx * 56, (personIdx + 1) * 56);

    // First 51 values are keypoints (17 keypoints × 3 values each)
    const keypoints = [];
    let hasValidKeypoint = false;

    for (let keypointIdx = 0; keypointIdx < 17; keypointIdx++) {
      const baseIdx = keypointIdx * 3;
      const y = personData[baseIdx]; // Normalized y coordinate [0-1]
      const x = personData[baseIdx + 1]; // Normalized x coordinate [0-1]
      const confidence = personData[baseIdx + 2]; // Confidence score [0-1]

      keypoints.push({
        name: KEYPOINTS[keypointIdx],
        x: x * imageWidth, // Convert to pixel coordinates
        y: y * imageHeight, // Convert to pixel coordinates
        confidence: confidence,
      });

      // Check if person has valid keypoints (confidence > threshold)
      if (confidence > 0.3) {
        hasValidKeypoint = true;
      }
    }

    // Only add person if they have valid keypoints
    if (hasValidKeypoint) {
      // Last 5 values might contain bounding box info
      const bbox = {
        ymin: personData[51] * imageHeight,
        xmin: personData[52] * imageWidth,
        ymax: personData[53] * imageHeight,
        xmax: personData[54] * imageWidth,
        score: personData[55],
      };

      detectedPeople.push({
        keypoints: keypoints,
        boundingBox: bbox,
        personId: personIdx,
      });
    }
  }

  return detectedPeople;
};

const parseSingleposeOutput = (output, imageWidth, imageHeight) => {
  "worklet";
  const detectedPeople = [];
  const outputArray = output; // Shape: [1, 1, 17]

  const personData = outputArray;

  // First 51 values are keypoints (17 keypoints × 3 values each)
  const keypoints = [];
  let hasValidKeypoint = false;

  for (let keypointIdx = 0; keypointIdx < 17; keypointIdx++) {
    const baseIdx = keypointIdx * 3;
    const y = personData[baseIdx]; // Normalized y coordinate [0-1]
    const x = personData[baseIdx + 1]; // Normalized x coordinate [0-1]
    const confidence = personData[baseIdx + 2]; // Confidence score [0-1]

    keypoints.push({
      name: KEYPOINTS[keypointIdx],
      x: x * imageWidth, // Convert to pixel coordinates
      y: y * imageHeight, // Convert to pixel coordinates
      confidence: confidence,
    });

    // Check if person has valid keypoints (confidence > threshold)
    if (confidence > 0.3) {
      hasValidKeypoint = true;
    }
  }

  // Only add person if they have valid keypoints
  if (hasValidKeypoint) {
    // Last 5 values might contain bounding box info
    //   const bbox = {
    //     ymin: personData[51] * imageHeight,
    //     xmin: personData[52] * imageWidth,
    //     ymax: personData[53] * imageHeight,
    //     xmax: personData[54] * imageWidth,
    //     score: personData[55],
    //   };

    detectedPeople.push({
      keypoints: keypoints,
      //boundingBox: bbox,
      personId: 0,
    });
  }

  return detectedPeople;
};

const ratios = {
  width: 390 / 1080,
  height: 844 / 1920,
};
const scaleFactor = 3;
const diff = 2532 - 1424.25;

// 1170/2532 (1170/1424.25)
export default function DronePage() {
  const { top, bottom } = useSafeAreaInsets();
  const { width, height, scale } = useWindowDimensions();

  const [steps, setSteps] = useState([
    {
      description:
        "Approach the vehicle directly in front of the officers vehicle.",
      completed: false,
    },
    {
      description:
        "Check the vehicle for its make, model, and license plate number.",
      completed: false,
    },
    {
      description:
        "Hello, you are being pulled over for speeding. You were recorded going 80 in a 55.",
      completed: false,
    },
    {
      description:
        "Verify the vehicle number of the individuals, ensure that seatbelts are fastened, and check for any potential weapons.",
      completed: false,
    },
    {
      description:
        "Ask the driver to hold the back of their license up to be scanned.",
      completed: false,
    },
    {
      description:
        "Ask the driver to hold up their registration to be scanned.",
      completed: false,
    },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [idInfo, setIdInfo] = useState<{
    firstName: string;
    lastName: string;
    state: string;
    city: string;
    issueState: string;
    sex: string;
    over21: boolean;
    class: string;
  } | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [poses, setPoses] = useState<
    { x: number; y: number; name: string; confidence?: number }[]
  >([]);
  const left_shoulder = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const right_shoulder = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const left_elbow = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const right_elbow = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const left_wrist = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const right_wrist = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const left_hip = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const right_hip = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const left_knee = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const right_knee = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const left_ankle = useSharedValue({ x: 0, y: 0, confidence: 0 });
  const right_ankle = useSharedValue({ x: 0, y: 0, confidence: 0 });

  const device = useCameraDevice("back");

  const { hasPermission } = useCameraPermission();

  const colorProgress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ["#FFFFFF", "#00FF00"] // white to green
    );

    return {
      borderColor,
    };
  });
  const animateBox = () => {
    colorProgress.value = withSequence(
      withTiming(1, { duration: 100 }), // animate to green
      withDelay(0, withTiming(0, { duration: 100 })) // wait 100ms, then back to white
    );
  };

  const codeScanner = useCodeScanner({
    codeTypes: ["pdf-417"],
    onCodeScanned: (codes) => {
      const { value } = codes[0];
      const fields = value?.split("\n").slice(2)!;
      const parsedData = Object.fromEntries(
        fields.map((field) => {
          const fieldId = field.substring(
            0,
            3
          ) as keyof typeof pdf417FieldMapping;
          const data = field.slice(3);
          return [pdf417FieldMapping[fieldId], data];
        })
      );
      animateBox();
      setIdInfo({
        firstName: parsedData["Customer First Name"],
        lastName: parsedData["Customer Family Name"],
        state: parsedData["Address - Jurisdiction Code"],
        city: parsedData["Address - City"],
        issueState: parsedData["Address - Jurisdiction Code"],
        sex:
          parsedData["Physical Description - Sex"] === "1" ? "Male" : "Female",
        over21: true,
        class: parsedData["Jurisdiction-Specific Vehicle Class"] ?? "C",
      });
    },
  });

  const options: ImageLabelingOptions = { minConfidence: 0.77 };
  const { scanImage } = useImageLabeler(options);
  const handleDetectedLabels = Worklets.createRunOnJS(
    (
      labels: {
        confidence: number;
        label: string;
      }[]
    ) => {
      setLabel(labels[0].label);
    }
  );

  //   const objectClassification = useTensorflowModel(
  //     require("@/assets/models/movinet-tflite-a2-stream-kinetics-600-classification-tflite-int8-v1.tflite")
  //   );
  //   const ocModel =
  //     objectClassification.state === "loaded"
  //       ? objectClassification.model
  //       : undefined;

  const poseDetection = useTensorflowModel(
    require("@/assets/models/movenet-tflite-singlepose-lightning-tflite-int8-v1.tflite")
  );
  const pdModel =
    poseDetection.state === "loaded" ? poseDetection.model : undefined;
  const springOpts = {};
  const handleDetectedPoses = Worklets.createRunOnJS(
    (poses: { x: number; y: number; name: string; confidence: number }[]) => {
      // poses.forEach((pose) => {
      //   if (pose.confidence > 0.2) {
      //     switch (pose.name) {
      //       case "left_shoulder":
      //         left_shoulder.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "right_shoulder":
      //         right_shoulder.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "left_elbow":
      //         left_elbow.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "right_elbow":
      //         right_elbow.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "left_wrist":
      //         left_wrist.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "right_wrist":
      //         right_wrist.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "left_hip":
      //         left_hip.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "right_hip":
      //         right_hip.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "left_knee":
      //         left_knee.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "right_knee":
      //         right_knee.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "left_ankle":
      //         left_ankle.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       case "right_ankle":
      //         right_ankle.value = withSpring({ ...pose }, springOpts);
      //         break;
      //       default:
      //     }
      //   }
      // });
      setPoses(poses);
    }
  );
  const TARGET_FPS = 10;
  const { resize } = useResizePlugin();
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      // Label Detection
      const data = Array.from(
        scanImage(frame) as unknown as {
          confidence: number;
          label: string;
        }[]
      );
      data.sort((a, b) => b.confidence - a.confidence);
      handleDetectedLabels(data);
      // MoveNet Detection
      // Object Classification
      //   if (!!ocModel) {
      //     const resized = resize(frame, {
      //       scale: {
      //         width: 224,
      //         height: 224,
      //       },
      //       pixelFormat: "rgb",
      //       dataType: "uint8",
      //     });
      //     const outputs = ocModel.runSync([resized]);
      //     console.log(outputs);
      //   }
      //

      runAtTargetFps(TARGET_FPS, () => {
        "worklet";
        // Pose Detection
        if (!!pdModel) {
          const resized = resize(frame, {
            scale: {
              width: 192,
              height: 192,
            },
            pixelFormat: "rgb",
            dataType: "uint8",
          });
          const output = pdModel.runSync([resized]);
          const detectedPeople = parseSingleposeOutput(
            output[0],
            frame.width,
            frame.height
          );
          const validPeople = detectedPeople.filter((person) =>
            person.keypoints.some((kp) => kp.confidence > 0.5)
          );
          // console.log(validPeople[0]?.keypoints ?? []);
          handleDetectedPoses(
            validPeople[0]?.keypoints.filter(
              (point) =>
                true ||
                [
                  "left_shoulder",
                  "right_shoulder",
                  "left_elbow",
                  "right_elbow",
                  "left_wrist",
                  "right_wrist",
                  "left_hip",
                  "right_hip",
                  "left_knee",
                  "right_knee",
                  "left_ankle",
                  "right_ankle",
                ].includes(point.name)
            ) ?? []
          );
        }
      });
    },
    [handleDetectedLabels, handleDetectedPoses]
  );

  const trigger = () => {
    animateBox();
    if (stepIndex === steps.length - 1) {
      router.push("/tasks/police/1234/completed");
    } else {
      setStepIndex((index) => index + 1);
    }
  };
  const fontStyle = {
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "bold",
  };
  const font = matchFont(fontStyle);

  useEffect(() => {
    //console.log(pdModel?.outputs);
    console.log(width, height, scale);
  }, [scale, width, height]);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}>
      {
        <Camera
          style={StyleSheet.absoluteFill}
          outputOrientation="preview"
          device={device as CameraDevice}
          frameProcessor={frameProcessor}
          codeScanner={codeScanner}
          isActive={true}
          resizeMode="cover"
        />
      }
      <Canvas style={StyleSheet.absoluteFill}>
        {poses.map(({ x, y, name }) => (
          <Group key={name}>
            <Circle
              cy={(x / 1.33 + diff / 2) / scaleFactor}
              cx={390 - y / scaleFactor}
              r={4}
              color="red"
            ></Circle>
            <CanvasText
              y={(x / 1.33 + diff / 2) / scaleFactor - 10}
              x={390 - y / scaleFactor}
              text={name}
              font={font}
              color="black"
              style={"stroke"}
              strokeWidth={2}
            />
            <CanvasText
              y={(x / 1.33 + diff / 2) / scaleFactor - 10}
              x={390 - y / scaleFactor}
              text={name}
              font={font}
              color="white"
            />
          </Group>
        ))}
        {/* <Group>
        <Line
          p1={vec(
            390 - left_shoulder.value.y / scaleFactor,
            (left_shoulder.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_shoulder.value.y / scaleFactor,
            (right_shoulder.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - left_hip.value.y / scaleFactor,
            (left_hip.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_hip.value.y / scaleFactor,
            (right_hip.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - left_shoulder.value.y / scaleFactor,
            (left_shoulder.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - left_hip.value.y / scaleFactor,
            (left_hip.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - right_shoulder.value.y / scaleFactor,
            (right_shoulder.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_hip.value.y / scaleFactor,
            (right_hip.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />

        <Line
          p1={vec(
            390 - left_shoulder.value.y / scaleFactor,
            (left_shoulder.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - left_elbow.value.y / scaleFactor,
            (left_elbow.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - left_wrist.value.y / scaleFactor,
            (left_wrist.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - left_elbow.value.y / scaleFactor,
            (left_elbow.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - right_shoulder.value.y / scaleFactor,
            (right_shoulder.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_elbow.value.y / scaleFactor,
            (right_elbow.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - right_wrist.value.y / scaleFactor,
            (right_wrist.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_elbow.value.y / scaleFactor,
            (right_elbow.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />

        <Line
          p1={vec(
            390 - left_hip.value.y / scaleFactor,
            (left_hip.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - left_knee.value.y / scaleFactor,
            (left_knee.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - left_ankle.value.y / scaleFactor,
            (left_ankle.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - left_knee.value.y / scaleFactor,
            (left_knee.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - right_hip.value.y / scaleFactor,
            (right_hip.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_knee.value.y / scaleFactor,
            (right_knee.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        <Line
          p1={vec(
            390 - right_ankle.value.y / scaleFactor,
            (right_ankle.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          p2={vec(
            390 - right_knee.value.y / scaleFactor,
            (right_knee.value.x / 1.33 + diff / 2) / scaleFactor
          )}
          color={"red"}
          style="stroke"
          strokeWidth={2}
        />
        </Group> */}
      </Canvas>
      <View
        style={{
          position: "absolute",
          padding: Spacing.block.medium,
          top: top,
          width: "100%",
        }}
      >
        <Toast
          title={`Step ${Math.min(stepIndex + 1, steps.length)}`}
          subtitle={steps[stepIndex].description}
        >
          <View>
            <AnimatedCircularProgress
              size={54}
              width={5}
              fill={(stepIndex / 6) * 100}
              rotation={0}
              tintColor={Colors.brand.primary.color}
              backgroundColor={Colors.gray.light[900]}
            />
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
              }}
            >
              <Text style={{ fontSize: Font.size.small }}>
                {Intl.NumberFormat("en-US", {
                  style: "percent",
                  maximumFractionDigits: 0,
                }).format(stepIndex / 6)}
              </Text>
            </View>
          </View>
        </Toast>
      </View>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            borderWidth: 1,
            width: boxSize,
            height: boxSize,
            transform: [
              { translateX: boxSize / -2 },
              { translateY: boxSize / -2 },
            ],
          },
          animatedStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => trigger()} />
      </Animated.View>
      <View
        style={{
          position: "absolute",
          padding: Spacing.block.medium,
          gap: Spacing.block.medium,
          bottom: bottom,
          width: "100%",
        }}
      >
        {label !== null ? (
          <View
            style={{
              padding: Spacing.block.xxsmall,
              paddingHorizontal: Spacing.block.medium,
              borderRadius: Spacing.block.small * 4,
              alignItems: "center",
              alignSelf: "center",
              overflow: "hidden",
            }}
          >
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={[
                Colors.brand.primary.highlight,
                Colors.brand.primary.tint,
              ]}
              locations={[0.25, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
            <Text
              style={{
                fontSize: Font.size.xlarge,
                fontWeight: "bold",
                color: Colors.dark.text,
              }}
            >
              {label}
            </Text>
          </View>
        ) : null}
        {idInfo !== null ? (
          <View
            style={{
              borderRadius: Spacing.block.medium,
              backgroundColor: Colors.light.background,
              overflow: "hidden",
            }}
          >
            <View>
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={[
                  Colors.brand.primary.highlight,
                  Colors.brand.primary.tint,
                ]}
                locations={[0.25, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: Spacing.block.xsmall,
                  padding: Spacing.block.xsmall,
                  marginBottom: Spacing.block.xxsmall,
                }}
              >
                <Text
                  style={{
                    color: Colors.gray.light["900"],
                    fontSize: Font.size.large,
                    fontWeight: "bold",
                  }}
                >
                  State Identification
                </Text>
                <TouchableOpacity
                  onPress={() => setIdInfo(null)}
                  style={{ padding: 12 }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderTopLeftRadius: Spacing.block.small,
                  borderTopRightRadius: Spacing.block.small,
                  height: Spacing.block.small,
                  backgroundColor: "white",
                }}
              ></View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: Spacing.block.medium,
                alignItems: "center",
                padding: Spacing.block.medium,
                paddingTop: 0,
              }}
            >
              <View>
                <StateIcon
                  width={64}
                  height={64}
                  state={idInfo.state ?? "TX"}
                />
              </View>
              <View style={{ gap: Spacing.text.xxsmall, flexShrink: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: Font.size.large }}>
                  {idInfo.firstName} {idInfo.lastName}
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: Font.size.medium,
                    color: Colors.gray.dark["500"],
                  }}
                >
                  {idInfo.city}, {idInfo.state}
                </Text>
                <Text
                  style={{
                    fontSize: Font.size.small,
                    color: Colors.gray.dark["500"],
                  }}
                >
                  {idInfo.sex} &middot; {idInfo.over21 ? "Over 21" : "Under 21"}{" "}
                  &middot; Class {idInfo.class}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={{ fontWeight: "500", color: Colors.dark.text }}>
            Exit/Cancel Task
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: Colors.light.background,
    borderWidth: 1,
    padding: Spacing.block.xsmall,
    borderRadius: Spacing.block.xsmall * 4,
    alignItems: "center",
  },
});
