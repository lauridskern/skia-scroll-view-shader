import { Image } from 'expo-image';
import { Dimensions, PixelRatio, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Canvas, Image as SkiaImage, useImage, Group, Rect, Paint, DisplacementMap, RadialGradient, vec, LinearGradient, ImageShader, translate } from '@shopify/react-native-skia';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 1',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1675368244123-082a84cf3072?q=80&w=2300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 2',
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 3',
  },
  {
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 4',
  },
  {
    url: 'https://images.unsplash.com/photo-1715128083452-065d5045bac1?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 5',
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 6',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1689596509629-bc6f6a455fa1?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 7',
  },
  {
    url: 'https://images.unsplash.com/photo-1715090488848-4d05af86009b?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 8',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1668989820410-6c02365835af?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Image 9',
  },
  {
    url: 'https://via.placeholder.com/150',
    title: 'Image 10',
  },
];
const itemHeight = 150;
const itemWidth = 150;
const gap = 10;
const topOffset = (screenHeight - itemHeight) / 2;

//you can play around with these values to stretch the displacement map and achieve different distortions
const displacementMapWidth = 1236;
const displacementMapHeight = 800;

export default function App() {
  const scrollX = useSharedValue(0);
  const displacementMap = useImage('http://tavmjong.free.fr/INKSCAPE/MANUAL/images/FILTERS/bubble.png');

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      console.log(event.contentOffset.x);
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem = ({ item }: any) => <Image source={{ uri: item.url }} style={{ width: itemWidth, height: itemHeight }} />;

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} pointerEvents="none">
        <Group
          layer={
            <Paint>
              <DisplacementMap channelX="r" channelY="g" scale={100}>
                {/* workaround for "DisplacementMap expects a shader as child" */}
                <RadialGradient r={0} c={vec(0, 0)} colors={['black', 'white']} />
                <ImageShader image={displacementMap} fit="fill" rect={{ x: (screenWidth - displacementMapWidth) / 2, y: (screenHeight - displacementMapHeight) / 2, width: displacementMapWidth, height: displacementMapHeight }} />
              </DisplacementMap>
            </Paint>
          }
        >
          <Group transform={[{ translateY: topOffset }]}>
            {images.map((image, index) => {
              const x = useDerivedValue(() => {
                return index * itemWidth + index * gap - scrollX.value;
              });
              return <SkiaImage key={index} x={x} y={0} image={useImage(image.url)} width={itemWidth} height={itemHeight} fit="cover" />;
            })}
          </Group>
        </Group>

        {/* edge gradients */}
        <Rect x={0} y={0} width={50} height={screenHeight} antiAlias>
          <LinearGradient start={vec(0, 0)} end={vec(50, 0)} colors={['black', 'transparent']} />
        </Rect>
        <Rect x={screenWidth - 50} y={0} width={50} height={screenHeight}>
          <LinearGradient start={vec(screenWidth, 0)} end={vec(screenWidth - 50, 0)} colors={['black', 'transparent']} />
        </Rect>
      </Canvas>

      <Animated.FlatList contentInset={{ left: (screenWidth - itemWidth) / 2, right: (screenWidth - itemWidth) / 2 }} data={images} renderItem={renderItem} horizontal onScroll={scrollHandler} contentContainerStyle={styles.contentContainer} style={styles.flatList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  canvas: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  flatList: {
    flexGrow: 0,
    opacity: 0,
  },
  contentContainer: {
    gap: gap,
    justifyContent: 'center',
  },
});
