import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Background gradient effect
import { db } from "../comp/firebase"; // Import Firebase
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";

// Define Player interface (now stored inside `users` collection)
interface Player {
  id: string;
  username: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  // Fetch leaderboard data from USERS collection
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
        const q = query(collection(db, "users"), orderBy("points", "desc"));
        const snapshot = await getDocs(q);

        const leaderboardData: Player[] = snapshot.docs
            .filter((doc) => doc.data().points !== undefined) // Ensure users have points field
            .map((doc) => {
                const userData = doc.data();
                console.log("🔥 Retrieved User:", userData); // ✅ Log user data
                return {
                    id: doc.id, // Firestore user ID
                    username: userData.username || "Unknown", // Handle missing username
                    points: userData.points || 0, // Default to 0 if missing
                };
            });

        console.log("🔥 Final Leaderboard Data:", leaderboardData); // ✅ Log final data array
        setPlayers(leaderboardData);
    } catch (error) {
        console.error("❌ Error fetching leaderboard: ", error);
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Function to update player points
  const updatePlayerPoints = async (playerId: string, points: number) => {
    try {
      const userRef = doc(db, "users", playerId);
      await updateDoc(userRef, { points });
      setMessage(`Points updated for ${playerId}!`);
      fetchLeaderboard(); // Refresh leaderboard
    } catch (error) {
      console.error("Error updating points: ", error);
    }
  };

  // Display loading message
  if (loading) {
    return <Text style={styles.loadingText}>Loading leaderboard...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.gradient}>
        <Text style={styles.header}>Leaderboard</Text>

        {/* Show message */}
        {message && <Text style={styles.message}>{message}</Text>}

        {/* Leaderboard List */}
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.playerRow}>
              <Text style={styles.playerText}>
                {index + 1}. {item.username} - {item.points} pts
              </Text>
              <TouchableOpacity onPress={() => updatePlayerPoints(item.id, item.points + 10)}>
                <Text style={styles.button}>+10 Points</Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },
});

export default Leaderboard;