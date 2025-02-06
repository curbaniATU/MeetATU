import { router } from "expo-router";
import { Button } from "react-native";

export default function Chat() {

    return(
        <Button
        title="Back Home" 
        onPress={() => router.replace("/home")}
        color="#007bff"
        />
    )
    
}