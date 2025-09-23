import { Image, Toast } from "@/components";
import { Colors, Font, Spacing } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CameraDevice,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner
} from "react-native-vision-camera";


const boxSize = 280;

export default function DronePage() {
  const [steps,setSteps] = useState( [
  {description: "Approach the vehicle directly in front of the officers vehicle.", completed:false},
  {description: "Check the vehicle for its make, model, and license plate number.", completed:false},
  {description: "Hello, you are being pulled over for speeding. You were recorded going 80 in a 55.", completed:false},
  {description:"Verify the vehicle number of the individuals, ensure that seatbelts are fastened, and check for any potential weapons.", completed:false},
  {description: "Ask the driver to hold the back of their license up to be scanned.", completed:false},
  {description:  "Ask the driver to hold up their registration to be scanned.", completed:false},
]
)
  const [stepIndex, setStepIndex] = useState(0);
  const device = useCameraDevice("back");
    const {top, bottom} = useSafeAreaInsets();
  const { hasPermission } = useCameraPermission();
  const [boxColor, setBoxColor] = useState("white");

  const codeScanner = useCodeScanner({
  codeTypes: ['pdf-417'],
  onCodeScanned: (codes) => {
    console.log(`Scanned ${codes.length} codes!`)
  }
})
//   const frameProcessor = useSkiaFrameProcessor((frame) => {
//   'worklet'
// // const paint = Skia.Paint()
// //     paint.setColor(Skia.Color('white'))
// //     paint.setStrokeWidth(2)
// //       const centerX = frame.width / 2
// //   const centerY = frame.height / 2
// //   const rect = Skia.XYWHRect(centerX, centerY, 150, 150)
// //   frame.render()
// //   frame.drawRect( rect ,paint)
// }, [])

  const trigger=()=>{
    setBoxColor("green")
    setTimeout(()=>{setBoxColor("white")},150)
    if(stepIndex===steps.length-1){
        router.push("/tasks/police/1234/completed")
    } else {
      setStepIndex(index=>index+1)
    }
    
  }
  // const doTask = (cb)=>{
  //   trigger();
    
  //   setSteps(oldSteps=>{
  //     const temp = [...oldSteps];
  //     temp[stepIndex].completed = true;
  //     return temp
  //   })
  //   setTimeout(()=>{
  //     setStepIndex(oldVal=>Math.min(oldVal+1, steps.length))
  //   }
  //     ,2000)
  //   cb()
  // }
  // const scheduleTask=()=>{
  //   setTimeout(()=>doTask(()=>{
  //       if(stepIndex<steps.length){
  //     scheduleTask()
  //   } else {
  //     setTimeout(()=>router.push("/tasks/police/1234/completed"))
  //   }
  //   }),5000)
  
  // }

  // useEffect(()=>{
  //   scheduleTask()
  // },[])

  const toastTitle = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.text.xxsmall,
      }}
    >
      {stepIndex === steps.length || steps[stepIndex].completed ? (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("@/assets/icons/check-circle-green.png")}
        />
      ) : (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("@/assets/icons/check-circle-gray.png")}
        />
      )}
      <Text style={{ fontWeight: "500", fontSize: Font.size.large }}>
        Step {Math.min(stepIndex + 1,steps.length)}
      </Text>
    </View>
  );
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}>
      {
        <Camera
          style={StyleSheet.absoluteFill}
          device={device as CameraDevice}
          // frameProcessor={frameProcessor}
          codeScanner={codeScanner}
          isActive={true}
        />
      }
      <View
        style={{
          position: "absolute",
          padding: Spacing.block.medium,
          top: top,
          width: "100%",
        }}
        onPress={()=>trigger()}
      >
        <Toast
          title={toastTitle}
          subtitle={
            "Ask the driver to hold up their registration to be scanned."
          }
        >
          <View>
          <AnimatedCircularProgress
              size={54}
              width={5}
              fill={stepIndex / 6 *100}
              rotation={0}
              tintColor={Colors.brand.primary.color}
              backgroundColor={Colors.gray.light[900]}/>
              <View style={{position:"absolute", top:"50%",left:"50%", transform: [{translateX:"-50%"},{translateY:"-50%"}]}}> <Text style={{fontSize:Font.size.small}}>
              {Intl.NumberFormat("en-US", {
                style: "percent",
                maximumFractionDigits: 0,
              }).format(stepIndex / 6)}
            </Text></View>
           
          </View>
        </Toast>
      </View>
      <Pressable onPress={()=> trigger()} style={{position:"absolute", top:"50%", left:"50%", borderWidth:1, borderColor:boxColor, width:boxSize, height: boxSize, transform: [{translateX:boxSize/-2}, {translateY:boxSize/-2}]}}>

      </Pressable>
      <View
        style={{
          position: "absolute",
          padding: Spacing.block.medium,
          bottom: bottom,
          width: "100%",
        }}
      >
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
