import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const API_KEY = "f09f6ba15c384b44b3b466d3547b6df6";
const BASE_URL = "https://api.themoviedb.org/3";

interface MovieItem {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

const Movie = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const flatListRef = useRef<FlatList<MovieItem> | null>(null);

  useEffect(() => {
    fetchMovies(1, true);
  }, []);

  const fetchMovies = async (pageNumber = 1, isNewSearch = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageNumber}`
      );
      if (response.data.results) {
        setMovies((prevMovies) =>
          isNewSearch
            ? response.data.results
            : [...prevMovies, ...response.data.results]
        );

        setPage(pageNumber);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovie = async () => {
    if (!query.trim()) return;
    setIsRefreshing(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=1`
      );
      if (response.data.results) {
        setMovies(response.data.results);
        setPage(1);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMoreMovies = () => {
    if (!loading) {
      fetchMovies(page + 1);
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true }); // ✅ Scroll to top
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity style={styles.button} onPress={searchMovie}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        onEndReached={loadMoreMovies} // ✅ Fetch next page when reaching end
        onEndReachedThreshold={0.5} // ✅ Trigger when halfway scrolled
        refreshing={isRefreshing} // ✅ Show loading when searching
        onRefresh={() => fetchMovies(1, true)} // ✅ Refresh to load page 1
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#007bff" /> : null
        }
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
              }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieYear}>{item.release_date}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={scrollToTop}>
        <Text style={styles.floatingButtonText}>↑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    width: 110,
  },
  poster: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 9,
  },
  movieYear: {
    fontSize: 12,
    color: "gray",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007bff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Movie;
