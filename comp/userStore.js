import React, { useState, useEffect } from 'react';
import { db } from '../comp/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { SafeAreaView, Text, StyleSheet, FlatList, View } from 'react-native';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const leaderboardQuery = query(
      collection(db, 'leaderboard'),
      orderBy('points', 'desc'), // Sort by points in descending order
      limit(10) // Show top 10 users
    );

    const unsubscribe = onSnapshot(leaderboardQuery, (snapshot) => {
      const leaderboardData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaderboard(leaderboardData);
    });

    return () => unsubscribe(); // Clean up listener when component unmounts
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.userContainer}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.points}>{item.points} points</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  userContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 18,
    color: '#555',
  },
  points: {
    fontSize: 16,
    color: '#888',
  },
});

export default Leaderboard;
