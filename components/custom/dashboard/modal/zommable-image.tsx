import React from "react";
import { Image, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export function ZoomableImage({ uri }: { uri: string }) {
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1); // reset zoom
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
          <AnimatedImage
            source={{ uri }}
            style={[
              {
                width: screenWidth,
                height: screenHeight,
                resizeMode: "contain",
              },
              animatedStyle,
            ]}
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
