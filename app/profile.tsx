import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { auth, db } from "../comp/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../comp/BottomNavForProfile';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList
} from "react-native";

// Define avatar options with filenames for matching
const avatarOptions = [
  { filename: "black.png", source: require('../assets/Avatars/black.png') },
  { filename: "blueCowboy.png", source: require('../assets/Avatars/blueCowboy.png') },
  { filename: "greenCowboy.png", source: require('../assets/Avatars/greenCowboy.png') },
  { filename: "pinkTiara.png", source: require('../assets/Avatars/pinkTiara.png') },
  { filename: "red.png", source: require('../assets/Avatars/red.png') },
  { filename: "tealTiara.png", source: require('../assets/Avatars/tealTiara.png') }
];

export default function Profile() {
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [classification, setClassification] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]); // Default avatar
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);
            setBio(data.bio || '');
            setMajor(data.major || '');
            setClassification(data.classification || '');
            // If points is not available, default to 0.
            // (Assuming you store the points field in your Firestore document.)

            const avatarFilename = data.profileAvatar?.split('/').pop()?.trim();
            console.log("Fetched avatar filename:", avatarFilename);

            const matchedAvatar = avatarOptions.find(a => a.filename === avatarFilename);
            if (matchedAvatar) {
              setSelectedAvatar(matchedAvatar);
            } else {
              setSelectedAvatar(avatarOptions[0]);
            }
          } else {
            console.log("No User Data exists");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditProfile = async () => {
    if (isEditing) {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          console.log("Saving profile changes...");

          await updateDoc(docRef, {
            bio,
            major,
            classification,
          });

          Alert.alert("Success", "Profile updated successfully!");
          setIsEditing(false);

          // Update user details immediately after saving
          setUserDetails((prevDetails: typeof userDetails) => ({
            ...prevDetails,
            bio,
            major,
            classification,
          }));
        }
      } catch (error) {
        console.error("Update error:", error);
        Alert.alert("Error", "Could not update profile. Please try again.");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleAvatarSelection = async (avatar: { filename: string; source: any }) => {
    try {
      setSelectedAvatar(avatar);
      console.log("Avatar selected and saving:", avatar.filename);

      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          profileAvatar: `${avatar.filename}` // Save properly formatted path
        });

        // Explicitly define the type of prevDetails to avoid TypeScript error
        setUserDetails((prevDetails: typeof userDetails) => ({
          ...(prevDetails as any),
          profileAvatar: `${avatar.filename}`,
        }));

        Alert.alert("Success", "Avatar updated successfully!");
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      Alert.alert("Error", "Could not update avatar. Please try again.");
    }
  };

  if (!userDetails) {
    return <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />;
  }

  return (
    
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <View style={styles.container}>

      {/* Settings Button (Fixed Top Right) 
      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/setting")}>
        <Ionicons name="settings-outline" size={30} color="#24786D" />
      </TouchableOpacity>*/}

      {/* Header with name at the top */}
      <View style={styles.header}>
      <Text style={styles.nameText}>{`${userDetails.firstName || "First Name"} ${userDetails.lastName || "Last Name"}`}</Text>

      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
          <Image source={selectedAvatar.source} style={styles.profileImage} />
          <Image source={require('../assets/images/edit.png')} style={styles.editIcon} />
        </TouchableOpacity>
        <Text style={styles.avatarEditText}>Tap to change avatar</Text>
        </View>
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
            data={avatarOptions}
            numColumns={3}
            keyExtractor={(item) => item.filename}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                handleAvatarSelection(item);
                setModalVisible(false);
              }}>
                <Image source={item.source} style={styles.avatarOption} />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Bio:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio"
          />
        ) : (
          <Text style={styles.text}>{bio || "No bio provided"}</Text>
        )}

        <Text style={styles.label}>Major:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={major}
            onChangeText={setMajor}
            placeholder="Enter your major"
          />
        ) : (
          <Text style={styles.text}>{major}</Text>
        )}

        <Text style={styles.label}>Graduation Year:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={classification}
            onChangeText={setClassification}
            placeholder="Enter your classification"
          />
        ) : (
          <Text style={styles.text}>{classification}</Text>
        )}

        {/* New Points section */}
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.text}>{userDetails.points ?? 0}</Text>
      </View>

      {/* Side-by-side buttons */}

      <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.sideButton} onPress={handleEditProfile}>
          <Text style={styles.buttonText1}>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.sideButton2} onPress={async () => {
        await auth.signOut();
        router.replace("/login"); }}>
        <Text style={styles.buttonText2}>Logout</Text>
      </TouchableOpacity>
      </View>

      
      </View>
    <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#f5f5f5"
  },
  loading: { 
    flex: 1, 
    justifyContent: "center" 
  },
  header: { 
    alignItems: "center" 
  },
  nameText: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 5 
  },
  avatarSection: { 
    alignItems: 'center' 
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 4 
  },
  avatarEditText: { 
    color: '#ccc', 
    fontSize: 14, 
    marginBottom: 0 
  },
  detailsContainer: { 
    marginVertical: 10, 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 8 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333" 
  },
  text: { 
    fontSize: 16, 
    color: "#555", 
    marginBottom: 10 
  },
  input: { 
    fontSize: 16, 
    color: "#333", 
    marginBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ccc", 
    padding: 5 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.9)' 
  },
  avatarOption: { 
    width: 80, 
    height: 80, 
    margin: 10, 
    borderRadius: 40, 
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  avatarContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative', 
    marginBottom: 0 
  },
  editIcon: { 
    position: 'absolute', 
    bottom: 10, 
    right: 10, 
    width: 24, 
    height: 24 
  },
  // Button styles
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 30 
  },
  buttonText1: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign:"center" 
  },
  buttonText2: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold",
    textAlign:"center"
  },
  sideButton: { 
    backgroundColor: '#24786D', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    marginBottom: 20, 
    flex: 1, 
    alignItems: 'center', 
    marginHorizontal: 5 
  },
  sideButton2: { 
    backgroundColor: '#f54242', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    marginBottom: 20, 
    flex: 1, 
    alignItems: 'center', 
    marginHorizontal: 5 
  },
  settingsButton: {
    position: 'absolute',
    top: 50, 
    right: 20,
    padding: 10,
    borderRadius: 50,
    zIndex: 10, 
  },
  
});
