import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from "../comp/firebase";
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import BottomNavBar from '../comp/BottomNavBarForLeaderboard';
import useThemeStore from "@/comp/themeStore"; 

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

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
        const q = query(collection(db, "users"), orderBy("points", "desc"));
        const snapshot = await getDocs(q);

        const leaderboardData: Player[] = snapshot.docs
            .filter((doc) => doc.data().points !== undefined) 
            .map((doc) => ({
                id: doc.id, 
                username: doc.data().username || "Unknown", 
                points: doc.data().points || 0, 
            }));

        setPlayers(leaderboardData.slice(0, 3));
    } catch (error) {
        console.error("❌ Error fetching leaderboard: ", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const renderMedal = (index: number) => {
    if (index === 0) return "🥇"; 
    if (index === 1) return "🥈";
    if (index === 2) return "🥉"; 
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#ffffff" }]}>
      
      {/* ✅ Header Section */}
      <LinearGradient colors={darkMode ? ["#111111", "#555555"]  : ["#24786D", "#3EA325"]} style={styles.headerContainer}>
        <Text style={styles.header}>Leaderboard</Text>
      </LinearGradient>

      {/* ✅ Main Content (Flex: 1 to push BottomNavBar down) */}
      <View style={styles.contentContainer}>
        {message && <Text style={styles.message}>{message}</Text>}

        {loading ? (
          <Text style={[styles.loadingText, { color: darkMode ? "#ffffff" : "#333" }]}>Loading leaderboard...</Text>
        ) : (
          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[styles.playerRow, { backgroundColor: darkMode ? "#222" : "#ffffff" }]}>
                <Text style={[styles.playerText, { color: darkMode ? "#80cbc4" : "#333" }]}>
                  {renderMedal(index)} {index + 1}. {item.username} - {item.points} pts
                </Text>
              </View>
            )}
          />
        )}

        {/* ✅ How to Earn Points Section */}
        <Text style={[styles.chartHeader, { color: darkMode ? "#80cbc4" : "#007b5e" }]}>How to Earn Points</Text>
        <View style={[styles.chartContainer, { backgroundColor: darkMode ? "#1E1E1E" : "#ffffff", borderColor: darkMode ? "#555" : "#ddd" }]}>            
          <ScrollView style={styles.scrollContainer}>
            <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Message someone in a class: 5 points</Text>
            <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Message 5 people in a class: 20 points</Text>
            <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Make a study chat: 10 points</Text>
            <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Attend a study group: 20 points</Text>
            <Text style={[styles.chartText, { color: darkMode ? "#cccccc" : "#333" }]}>- Join a study event: 15 points</Text>
          </ScrollView>
        </View>
      </View>

      {/* ✅ Bottom Navigation Bar Flush to Bottom */}
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Leaderboard;

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,  // ✅ This ensures the content takes up all available space, pushing the nav bar down
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  playerText: {
    fontSize: 18,
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
    marginTop: 20,
  },
  chartContainer: {
    marginTop: 5,
    padding: 15,
    borderRadius: 10,
    marginBottom: 50,
  },
  chartHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartText: {
    fontSize: 16,
    marginBottom: 5,
  },
  scrollContainer: {
    maxHeight: 200,
  },
});
