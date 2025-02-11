import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const API_KEY = "f09f6ba15c384b44b3b466d3547b6df6";
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

interface MovieItem {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

const Movie = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.results) {
        setMovies(response.data.results);
        setTotalResults(response.data.total_results);
        setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie List</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
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
      <View>
        <Text>Total Results: {totalResults}</Text>
        <Text>Total Pages: {totalPages}</Text>
      </View>
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
});

export default Movie;
