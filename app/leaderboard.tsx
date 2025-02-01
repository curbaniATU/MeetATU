import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Button, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Add LinearGradient for the gradient effect
import { db } from "../config/firebase"; // Ensure correct Firebase import
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";

// Define player interface
interface Player {
  id: string;
  username: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  // Get the current semester
  const getCurrentSemester = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // January = 0, December = 11
    return month < 6 ? `Spring-${year}` : `Fall-${year}`;
  };

  // Fetch the leaderboard data
  const fetchLeaderboard = async () => {
    setLoading(true);
    const semester = getCurrentSemester();
    const q = query(
      collection(db, "players"),
      where("semester", "==", semester),
      orderBy("points", "desc")
    );

    const snapshot = await getDocs(q);
    const leaderboardData: Player[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      username: doc.data().username,
      points: doc.data().points,
    })) as Player[];

    setPlayers(leaderboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Update points for a user
  const updatePlayerPoints = async (playerId: string, points: number) => {
    try {
      const playerRef = doc(db, "players", playerId);
      await updateDoc(playerRef, {
        points: points,
      });
      setMessage('Points updated successfully!');
      fetchLeaderboard(); // Refresh leaderboard after update
    } catch (error) {
      console.error("Error updating points: ", error);
    }
  };

  // Reset leaderboard every semester
  const resetLeaderboard = async () => {
    try {
      const semester = getCurrentSemester();
      const q = query(collection(db, "players"), where("semester", "==", semester));
      const snapshot = await getDocs(q);

      snapshot.docs.forEach((docRef) => {
        updateDoc(docRef.ref, { points: 0 }); // Reset points to 0
      });

      setMessage('Leaderboard reset successfully!');
      fetchLeaderboard(); // Refresh leaderboard after reset
    } catch (error) {
      console.error("Error resetting leaderboard: ", error);
    }
  };

  // Loading state
  if (loading) {
    return <Text>Loading leaderboard...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient background using LinearGradient */}
      <LinearGradient
        colors={['#ff7e5f', '#feb47b']} // Change gradient colors as needed
        style={styles.gradient}
      >
        <Text style={styles.header}>Leaderboard - {getCurrentSemester()}</Text>

        {/* Display message */}
        {message && <Text style={styles.message}>{message}</Text>}

        {/* Leaderboard List */}
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.playerRow}>
              <Text style={styles.playerText}>
                {index + 1}. {item.username} - {item.points} points
              </Text>
              <TouchableOpacity onPress={() => updatePlayerPoints(item.id, item.points + 10)}>
                <Text style={styles.button}>Add Points</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Reset button for admin */}
        <TouchableOpacity onPress={resetLeaderboard} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Leaderboard</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerText: {
    fontSize: 18,
    color: 'white',
  },
  button: {
    color: '#feb47b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ff7e5f',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default Leaderboard;
