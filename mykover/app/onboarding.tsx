import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onboardingScreens } from "../lib/onboardingData";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < onboardingScreens.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Mark onboarding as seen and go directly to home
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/SignupStep1Screen");
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as seen and go directly to home
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/SignupStep1Screen");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={handleSkip}
        className="absolute z-10 top-16 right-6"
      >
        <Text className="text-base font-medium text-purple-600">Skip</Text>
      </TouchableOpacity>

      {/* Onboarding Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingScreens}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View
            className="items-center justify-center flex-1 px-8"
            style={{ width }}
          >
            <Animated.View
              style={{
                opacity: scrollX.interpolate({
                  inputRange: [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                  ],
                  outputRange: [0, 1, 0],
                  extrapolate: "clamp",
                }),
                transform: [
                  {
                    scale: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                      ],
                      outputRange: [0.9, 1, 0.9],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
              className="items-center justify-center flex-1"
            >
              {/* Title */}
              <Text className="mb-6 text-3xl font-bold text-center text-purple-600">
                {item.title}
              </Text>

              {/* Description */}
              <Text className="px-4 mb-12 text-base leading-relaxed text-center text-gray-600">
                {item.description}
              </Text>

              {/* Illustration */}
              <View className="items-center justify-center mb-8">
                <Animated.View
                  style={{
                    opacity: scrollX.interpolate({
                      inputRange: [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                      ],
                      outputRange: [0, 1, 0],
                      extrapolate: "clamp",
                    }),
                    transform: [
                      {
                        scale: scrollX.interpolate({
                          inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                          ],
                          outputRange: [0.9, 1, 0.9],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  }}
                >
                  <Image
                    source={item.image}
                    className="w-64 h-64"
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        )}
      />

      {/* Progress Indicators */}
      <View className="flex-row justify-center mb-8">
        {onboardingScreens.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: ["#E5E7EB", "#8B5CF6", "#E5E7EB"],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: dotWidth,
                height: 8,
                borderRadius: 4,
                backgroundColor,
                marginHorizontal: 4,
              }}
            />
          );
        })}
      </View>

      {/* CTA Section */}
      <View className="px-8 mb-10">
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          className="py-4 bg-purple-600 rounded-full shadow-md"
        >
          <Text className="text-lg font-bold text-center text-white">
            {currentIndex === onboardingScreens.length - 1
              ? "Commencer"
              : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
