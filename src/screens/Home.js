import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
import NetInfo from '@react-native-community/netinfo';

const API_URL =
  'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNetwork, setIsNetwork] = useState(true);
  const [refresh, setRefresh] = useState(false)

  const fetchImages = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const photoList = data.photos.photo;

      const imageUrls = photoList.map(photo => photo.url_s);
      setImages(imageUrls);
      setLoading(false);
      await AsyncStorage.setItem('cachedImages', JSON.stringify(imageUrls));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const loadCachedImages = async () => {
    try {
      const cachedImages = await AsyncStorage.getItem('cachedImages');
      if (cachedImages) {
        setImages(JSON.parse(cachedImages));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading cached images:', error);
    }
  };

  useEffect(() => {
    if (isNetwork) {
      fetchImages();
    } else {
      loadCachedImages();
    }
  }, [isNetwork]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsNetwork(state.isConnected);
    });
    return () => unsubscribe;
  }, []);

  const onPull = () => {
    setRefresh(true)

    setTimeout(() => {
      fetchImages();
      setRefresh(false)
    }, 3000)
  }

  if (loading) {
    return (
      <View style={styles.loaderstyle}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={item => item}
        refreshControl={<RefreshControl
          refreshing={refresh}
          onRefresh={() => onPull()}
        />}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item }} style={styles.imageStyle} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderstyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: width / 2.1,
    height: height / 3.2,
    margin: 5,
  },
});

export default Home;
