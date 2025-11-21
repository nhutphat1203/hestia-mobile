import { useAuth } from "@/hooks/auth_context";
import { Redirect, Stack } from "expo-router";

export const unstable_settings = {
  // Thêm tùy chọn để vô hiệu hóa chế độ tạm thời (optional)
  // experimentalDisableAsyncLayout: true,
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
    const { isLoggedIn, isLoading } = useAuth();
    if (isLoading) {
        return null;
    }
    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return (
        <Stack>
            <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }}
            />
        </Stack>
    )
}