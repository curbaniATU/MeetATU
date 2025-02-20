import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Background gradient effect
import { db } from "../comp/firebase"; // Import Firebase
import { collection, query, orderBy, getDocs, updateDoc, doc} from "firebase/firestore";
import BottomNavBar from '../comp/BottomNavBarForLeaderboard';
import useThemeStore from "@/comp/themeStore"; 

// Define Player interface (now stored inside `users` collection)
interface Player {
  id: string;
  username: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const { darkMode } = useThemeStore();
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
            .filter((doc) => doc.data().points !== undefined) 
            .map((doc) => {
                const userData = doc.data();
                console.log("🔥 Retrieved User:", userData); 
                return {
                    id: doc.id, 
                    username: userData.username || "Unknown", 
                    points: userData.points || 0, 
                };
            });

        console.log("🔥 Final Leaderboard Data:", leaderboardData); 
        const topPlayers = leaderboardData.slice(0, 3); 
        setPlayers(topPlayers);
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
      fetchLeaderboard(); 
    } catch (error) {
      console.error("Error updating points: ", error);
    }
  };


  if (loading) {
    return <Text style={[styles.loadingText, { color: darkMode ? "#ffffff" : "#333" }]}>Loading leaderboard...</Text>;
  }

  const renderMedal = (index: number) => {
    if (index === 0) return "🥇"; 
    if (index === 1) return "🥈";
    if (index === 2) return "🥉"; 
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#ffffff" }]}>
      <SafeAreaView style={styles.innerContainer}>
      <LinearGradient colors={darkMode ? ["#111111", "#555555"]  : ["#24786D", "#3EA325"]}style={styles.gradient}>          
      <Text style={[styles.header, { color: darkMode ? "#ffffff" : "#ffffff" }]}>Leaderboard</Text>
  
          {message && <Text style={styles.message}>{message}</Text>}
  
          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[styles.playerRow, { backgroundColor: darkMode ? "#222" : "#ffffff" }]}>
                <Text style={[styles.playerText, { color: darkMode ? "#80cbc4" : "#333" }]}>
                {index + 1}. {item.username} - {item.points} pts
                </Text>
              </View>
            )}
          />
  
  <Text style={[styles.chartHeader, { color: darkMode ? "#80cbc4" : "#007b5e" }]}>How to Earn Points</Text>
  <View style={[ styles.chartContainer,{ backgroundColor: darkMode ? "#1E1E1E" : "#ffffff", borderColor: darkMode ? "#555" : "#ddd" },]}>            
    <ScrollView style={styles.scrollContainer}>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Message someone in a class: 5 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Message 5 people in a class: 20 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Make a study chat: 10 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Attend a study group: 20 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Join a study event: 15 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Participate in a group chat: 5 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Reply to a message: 3 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- 20 points automatically for creating a profile</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Send a friend request: 5 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Accept a friend request: 5 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Log in daily: 5 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Leaderboard climb: 20 points</Text>
              <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Fill out major, bio, classification: 5 points</Text>
            </ScrollView>
          </View>
        </LinearGradient>
      </SafeAreaView>
  
      <View style={styles.bottomSpacing}></View>
      <BottomNavBar />
    </View>
  );
            }  
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
  chartContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  chartHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chartText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  scrollContainer: {
    maxHeight: 350, 
  },
  bottomSpacing: {
    height: 70, // Adjust the height as needed
  },
  innerContainer: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
  },

});

export default Leaderboard;
