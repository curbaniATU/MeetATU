import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from "../comp/firebase"; 
import { collection, query, orderBy, getDocs, updateDoc, doc} from "firebase/firestore";
import BottomNavBar from '../comp/BottomNavBarForLeaderboard';
import useThemeStore from "@/comp/themeStore"; 
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

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
  const router = useRouter();

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
                return {
                    id: doc.id, 
                    username: userData.username || "Unknown", 
                    points: userData.points || 0, 
                };
            });

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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }} />

      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient 
          colors={darkMode ? ["#111111", "#555555"] : ["#24786D", "#3EA325"]}
          style={{ flex: 1 }}
        >          
          {/* Header with Back Button & Leaderboard Title */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Leaderboard</Text>
          </View>
  
          {message && <Text style={styles.message}>{message}</Text>}
  
          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[styles.playerRow, { backgroundColor: "white", borderRadius: 10, padding: 8, marginVertical: 3 }]}>
                <Text style={[styles.playerText, { color: "#333" }]}>
                  {index + 1}. {item.username} - {item.points} pts
                </Text>
              </View>
            )}
          />
  
          <Text style={[styles.chartHeader, { color: "#ffffff", marginTop: -300 }]}>
            How to Earn Points
          </Text>
  
          {/* Scrollable "How to Earn Points" Section */}
          <ScrollView 
            style={{ flex: 1, marginHorizontal: 10, margin:10}}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={{ backgroundColor: "white", borderRadius: 10, padding: 13 }}>
              <Text style={[styles.chartText, { color: "#333" }]}>- Message someone in a class: 5 points</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Message 5 people in a class: 20 points</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Make a study chat: 10 points</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Attend a study group: 20 points</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Join a study event: 15 points</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Participate in a group chat: 5 points per message</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Reply to a message: 3 points per reply</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Create a profile: 20 points automatically</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Send a friend request: 5 points per request</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Accept a friend request: 5 points per accepted request</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Log in daily: 5 points per consecutive day</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Leaderboard climb: 20 points for reaching a new rank</Text>
              <Text style={[styles.chartText, { color: "#333" }]}>- Fill out major, bio, classification: 5 points</Text>
            </View>
          </ScrollView>
        </LinearGradient>
        <BottomNavBar />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#24786D",
  },
  iconButton: { 
    padding: 10 
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1, // Ensures the text stays centered
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, 
    margin: 10,
  },
  playerText: {
    fontSize: 18,
    color: 'white',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
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
    color:'white'
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
    height: 70, 
  },
  innerContainer: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
  },
});

export default Leaderboard;
