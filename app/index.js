import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const data = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
}));

const viewabilityConfig = {
  itemVisiblePercentThreshold: 95,
};

const ITEM_HEIGHT = 100;
const ITEM_MARGIN = 5;

const MyComponent = () => {
  const inset = useSafeAreaInsets();
  const id = 15;
  const isStickyVisible = useSharedValue(false);
  const translationY = useSharedValue(0);
  const isOffsetSet = useSharedValue(false);
  const offset = useSharedValue(0);

  const onViewableItemsChanged = ({ viewableItems }) => {
    isStickyVisible.value = viewableItems.some((item) => {
      return item.item.id === id;
    });
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
    if (!isOffsetSet.value && isStickyVisible.value) {
      offset.value = event.contentOffset.y;
      isOffsetSet.value = true;
    }
  });

  const stickyItemStyle = useAnimatedStyle(() => {
    return isStickyVisible.value
      ? {
          transform: [
            {
              translateY: -translationY.value + offset.value,
            },
          ],
        }
      : {
          transform: [{ translateY: 0 }],
        };
  });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={{ backgroundColor: "black" }}>
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingBottom: inset.bottom + ITEM_HEIGHT,
        }}
      />
      <Animated.View
        style={[styles.stickyContainer, stickyItemStyle]}
        pointerEvents={"none"}
      >
        <Text style={styles.stickyItemText}>Sticky Item is 15</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    paddingHorizontal: 10,
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  stickyItemText: {
    color: "white",
  },
  itemContainer: {
    backgroundColor: "blue",
    marginVertical: ITEM_MARGIN,
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    color: "white",
  },
});

export default MyComponent;
