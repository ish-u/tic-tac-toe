import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Button, Pressable, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";

// const Circle = ({ x, y, setBgColor }: { x: number; y: number; setBgColor: (value: string) => void }) => {
//   const startValue = useRef(new Animated.Value(0)).current;
//   const [color, setColor] = useState("#000");
//   const toggleColor = () => {
//     if (color === "#000") {
//       setBgColor("#000");
//       setColor("#fff");
//     } else {
//       setBgColor("#fff");
//       setColor("#000");
//     }
//   };
//   const endValue = 50;
//   const duration = 1000;
//   const positionStyle = StyleSheet.create({
//     square: {
//       height: 150,
//       width: 150,
//       backgroundColor: color,
//       borderRadius: 1000,
//       position: "absolute",
//       top: y,
//       left: x,
//       zIndex: 10,
//     },
//   });

//   useEffect(() => {
//     console.log(color, x, y);
//     Animated.timing(startValue, {
//       toValue: endValue,
//       duration: duration,
//       useNativeDriver: true,
//     }).start(() => {
//       startValue.setValue(0.0045);
//       toggleColor();
//     });
//   }, [x, y, startValue]);

//   return (
//     <TouchableNativeFeedback>
//       <View>
//         <Animated.View
//           style={[
//             positionStyle.square,
//             {
//               transform: [
//                 {
//                   scale: startValue,
//                 },
//               ],
//             },
//           ]}
//         ></Animated.View>
//       </View>
//     </TouchableNativeFeedback>
//   );
// };

// export function _App() {
//   const [bgColor, setBgColor] = useState("#000");
//   const [x, setX] = useState(100);
//   const [y, setY] = useState(10);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: bgColor,
//       // alignItems: "center",
//       // justifyContent: "center",
//       borderColor: "black",
//       zIndex: 10,
//       // position: "relative",
//     },
//   });

//   return (
//     <Pressable
//       style={styles.container}
//       onPress={(e) => {
//         setX(e.nativeEvent.pageX);
//         setY(e.nativeEvent.pageY);
//       }}
//     >
//       <Circle x={x} y={y} setBgColor={setBgColor} />
//       {/* <StatusBar style="light" /> */}
//     </Pressable>
//   );
// }

// Board
// Players
// Board Tile
// checkWinning

// const;

export default function App() {
  return <></>;
}
